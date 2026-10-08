import { Test, TestingModule } from '@nestjs/testing';
import { EditorialService } from './editorial.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ArticleType, ContentStatus } from '@eotc/contracts';
import { ForbiddenException } from '@nestjs/common';

describe('EditorialService', () => {
  let service: EditorialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditorialService,
        {
          provide: PrismaService,
          useValue: {
            article: {
              findMany: jest.fn().mockRejectedValue(new Error('DB offline')),
              findFirst: jest.fn().mockRejectedValue(new Error('DB offline')),
              create: jest.fn().mockRejectedValue(new Error('DB offline')),
              update: jest.fn().mockRejectedValue(new Error('DB offline')),
            },
            articleRevision: {
              create: jest.fn().mockRejectedValue(new Error('DB offline')),
            },
          },
        },
        {
          provide: AuditService,
          useValue: { record: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<EditorialService>(EditorialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should filter published articles by type (NEWS vs ARTICLE)', async () => {
    const news = await service.findAll({ type: ArticleType.NEWS });
    expect(news.length).toBeGreaterThan(0);
    expect(news.every((a) => a.type === ArticleType.NEWS)).toBe(true);

    const articles = await service.findAll({ type: ArticleType.ARTICLE });
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((a) => a.type === ArticleType.ARTICLE)).toBe(true);
  });

  it('should create an article draft with initial revision entry', async () => {
    const draft = await service.create(
      {
        slug: 'theological-feast-epiphany',
        type: ArticleType.ARTICLE,
        translations: [
          {
            locale: 'am',
            title: 'የጥምቀት በዓል ሃይማኖታዊና ታሪካዊ ፋይዳ',
            summary: 'ጥምቀት በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ታላቅ ዓመታዊ የጌታ በዓል ነው።',
          },
        ],
      },
      'author-editor-01',
    );

    expect(draft.status).toBe(ContentStatus.DRAFT);
    expect(draft.authorId).toBe('author-editor-01');
    expect(draft.revisions?.length).toBeGreaterThanOrEqual(1);
  });

  it('should update article and append a new revision snapshot', async () => {
    const article = await service.findOne('holy-synod-peace-declaration-2026');
    const initialRevs = article.revisions?.length || 0;

    const updated = await service.update(
      article.id,
      {
        revisionComment: 'Added official translation note in English',
        translations: [
          {
            locale: 'am',
            title: 'የተሻሻለ ርዕስ',
          },
        ],
      },
      'editor-rev-user',
    );

    expect(updated.revisions?.length).toBe(initialRevs + 1);
    const latest = updated.revisions?.[0];
    expect(latest?.comment).toBe('Added official translation note in English');
    expect(latest?.editorId).toBe('editor-rev-user');
  });

  it('should enforce separation of duties on article approval', async () => {
    const draft = await service.create(
      {
        slug: 'self-approve-article',
        translations: [{ locale: 'am', title: 'ሙከራ ጽሑፍ' }],
      },
      'author-id-99',
    );

    // Author tries to approve own article -> fails
    await expect(
      service.transitionStatus(
        draft.id,
        { targetStatus: ContentStatus.APPROVED },
        { id: 'author-id-99', role: 'MODERATOR' },
      ),
    ).rejects.toThrow(ForbiddenException);
  });
});
