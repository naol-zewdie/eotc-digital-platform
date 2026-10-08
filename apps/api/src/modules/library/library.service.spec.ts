import { Test, TestingModule } from '@nestjs/testing';
import { LibraryService } from './library.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ContentStatus, RightsStatus } from '@eotc/contracts';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('LibraryService', () => {
  let service: LibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryService,
        {
          provide: PrismaService,
          useValue: {
            book: {
              findMany: jest.fn().mockRejectedValue(new Error('DB offline')),
              findFirst: jest.fn().mockRejectedValue(new Error('DB offline')),
              create: jest.fn().mockRejectedValue(new Error('DB offline')),
              update: jest.fn().mockRejectedValue(new Error('DB offline')),
            },
            category: {
              findMany: jest.fn().mockRejectedValue(new Error('DB offline')),
            },
          },
        },
        {
          provide: AuditService,
          useValue: {
            record: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return canonical liturgical categories', async () => {
    const categories = await service.getCategories();
    expect(categories.length).toBeGreaterThanOrEqual(6);
    expect(categories.some((c) => c.slug === 'biblical')).toBe(true);
    expect(categories.some((c) => c.slug === 'liturgical')).toBe(true);
    expect(categories.some((c) => c.slug === 'patristic')).toBe(true);
  });

  it('should list published books by default for public users', async () => {
    const books = await service.findAll();
    expect(books.length).toBeGreaterThan(0);
    expect(books.every((b) => b.status === ContentStatus.PUBLISHED)).toBe(true);
  });

  it('should find book by slug with trilingual translations', async () => {
    const book = await service.findOne('metsehafe-qeddase');
    expect(book).toBeDefined();
    expect(book.slug).toBe('metsehafe-qeddase');
    expect(book.translations.length).toBe(3);
    const amharic = book.translations.find((t) => t.locale === 'am');
    expect(amharic?.title).toContain('መጽሐፈ ቅዳሴ');
  });

  it('should create a book draft with translations', async () => {
    const newBook = await service.create(
      {
        slug: 'test-anaphora-mary',
        categoryId: 'cat-liturgical',
        fileId: 'file-003',
        rightsId: 'rights-pub-001',
        translations: [
          {
            locale: 'am',
            title: 'ቅዳሴ ማርያም',
            description: 'የእመቤታችን ቅዳሴ',
          },
          {
            locale: 'en',
            title: 'Anaphora of Saint Mary',
          },
        ],
      },
      'author-user-123',
    );

    expect(newBook.status).toBe(ContentStatus.DRAFT);
    expect(newBook.createdById).toBe('author-user-123');
    expect(newBook.translations.length).toBe(2);
  });

  it('should enforce separation of duties: author cannot approve their own submission', async () => {
    // 1. Create a draft book
    const draft = await service.create(
      {
        slug: 'self-approval-test',
        categoryId: 'cat-liturgical',
        fileId: 'file-test',
        rightsId: 'rights-pub-001',
        translations: [{ locale: 'am', title: 'የግል ረቂቅ' }],
      },
      'creator-user-id',
    );

    // 2. Advance to IN_REVIEW
    await service.transitionStatus(
      draft.id,
      { targetStatus: ContentStatus.IN_REVIEW },
      { id: 'creator-user-id', role: 'EDITOR' },
    );

    // 3. Attempt approval by the same creator -> should fail with ForbiddenException
    await expect(
      service.transitionStatus(
        draft.id,
        { targetStatus: ContentStatus.APPROVED },
        { id: 'creator-user-id', role: 'MODERATOR' },
      ),
    ).rejects.toThrow(ForbiddenException);

    // 4. Approval by a different moderator should succeed
    const approved = await service.transitionStatus(
      draft.id,
      { targetStatus: ContentStatus.APPROVED },
      { id: 'different-moderator-id', role: 'MODERATOR' },
    );
    expect(approved.status).toBe(ContentStatus.APPROVED);
    expect(approved.approvedById).toBe('different-moderator-id');
  });

  it('should prevent publication if missing manuscript file or rights record', async () => {
    // Book with no fileId
    const draft = await service.create(
      {
        slug: 'no-file-book',
        categoryId: 'cat-patristic',
        translations: [{ locale: 'am', title: 'ያለ ፋይል የተጻፈ' }],
      },
      'author-id',
    );

    // Move to IN_REVIEW -> APPROVED
    await service.transitionStatus(
      draft.id,
      { targetStatus: ContentStatus.IN_REVIEW },
      { id: 'author-id' },
    );
    await service.transitionStatus(
      draft.id,
      { targetStatus: ContentStatus.APPROVED },
      { id: 'reviewer-id', role: 'MODERATOR' },
    );

    // Try to publish without fileId
    await expect(
      service.transitionStatus(
        draft.id,
        { targetStatus: ContentStatus.PUBLISHED },
        { id: 'reviewer-id', role: 'ADMINISTRATOR' },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject invalid transition jumps (e.g., DRAFT directly to PUBLISHED)', async () => {
    const draft = await service.create(
      {
        slug: 'direct-publish-skip',
        fileId: 'file-001',
        rightsId: 'rights-pub-001',
        translations: [{ locale: 'am', title: 'የዘለለ' }],
      },
      'author-id',
    );

    await expect(
      service.transitionStatus(
        draft.id,
        { targetStatus: ContentStatus.PUBLISHED },
        { id: 'author-id', role: 'EDITOR' },
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
