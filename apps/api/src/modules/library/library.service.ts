import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  ContentStatus,
  RightsStatus,
  AuditAction,
  BookDto,
  CategoryDto,
  BookTranslationDto,
} from '@eotc/contracts';
import {
  CreateBookInputDto,
  UpdateBookInputDto,
  TransitionBookDto,
} from './dto/library.dto';

@Injectable()
export class LibraryService {
  private readonly logger = new Logger(LibraryService.name);

  // Canonical Liturgical Categories
  private readonly canonicalCategories: CategoryDto[] = [
    {
      id: 'cat-biblical',
      slug: 'biblical',
      nameAm: 'መጻሕፍት ቅዱሳን',
      nameGez: 'መጻሕፍት ቅዱሳት',
      nameEn: 'Biblical & Canonical Scriptures',
      descriptionAm: 'የብሉይና የሐዲስ ኪዳን 81 አዕማደ መጻሕፍት።',
      descriptionEn: 'The 81 canonical books of the Old and New Testament.',
      bookCount: 81,
    },
    {
      id: 'cat-liturgical',
      slug: 'liturgical',
      nameAm: 'ሥርዓተ ቅዳሴና ጸሎት',
      nameGez: 'ሥርዓተ ቊርባን ወጸሎት',
      nameEn: 'Liturgical & Sacramental Texts',
      descriptionAm: 'አሥራ አራቱ ቅዳሴያት፣ መጽሐፈ ሰዓታት እና የጸሎት መጻሕፍት።',
      descriptionEn: 'The 14 Anaphoras, Horologion (Book of Hours), and Sacramental texts.',
      bookCount: 14,
    },
    {
      id: 'cat-patristic',
      slug: 'patristic',
      nameAm: 'ሃይማኖተ አበውና ድርሳናት',
      nameGez: 'ሃይማኖተ አበው ወድርሳናት',
      nameEn: 'Patristic & Dogmatic Literature',
      descriptionAm: 'የቀደምት የቤተክርስቲያን አባቶች ትምህርተ ሃይማኖትና ምስክርነት።',
      descriptionEn: 'Writings, dogmas, and homilies of the Orthodox Church Fathers.',
      bookCount: 25,
    },
    {
      id: 'cat-monastic',
      slug: 'monastic',
      nameAm: 'ገድላትና ገዳማዊ ታሪክ',
      nameGez: 'ገድላት ወዜና ገዳማት',
      nameEn: 'Hagiography & Monastic Traditions',
      descriptionAm: 'የቅዱሳን ጻድቃንና ሰማዕታት ገድልና የገዳማት ታሪክ።',
      descriptionEn: 'Lives of saints, martyrs, and history of ancient Ethiopian monasteries.',
      bookCount: 42,
    },
    {
      id: 'cat-canonical',
      slug: 'canonical',
      nameAm: 'ፍትሐ ነገሥትና ቀኖናዊ ሕግጋት',
      nameGez: 'ፍትሐ ነገሥት ወቀኖና',
      nameEn: 'Canon Law & Ecclesiastical Jurisprudence',
      descriptionAm: 'ፍትሐ ነገሥት፣ ዲድስቅልያ እና የሲኖዶስ ቀኖናዎች።',
      descriptionEn: 'Fetha Negest, Didascalia, and Holy Synod canonical statutes.',
      bookCount: 8,
    },
    {
      id: 'cat-hymnody',
      slug: 'hymnody',
      nameAm: 'ዜማና ቅኔ (ቅዱስ ያሬድ)',
      nameGez: 'ዜማ ወቅኔ ዘቅዱስ ያሬድ',
      nameEn: 'Yaredic Hymnology & Chants',
      descriptionAm: 'ድጓ፣ ጾመ ድጓ፣ ዝማሬ፣ መዋሥዕት እና ምዕራፍ።',
      descriptionEn: 'Diggua, Tsome Diggua, Ziq, and liturgical musical arrangements of St. Yared.',
      bookCount: 12,
    },
  ];

  // In-memory fallback dataset for offline and development environments
  private memoryBooks: BookDto[] = [
    {
      id: 'book-qeddase-01',
      slug: 'metsehafe-qeddase',
      status: ContentStatus.PUBLISHED,
      author: 'Holy Apostles & Church Fathers',
      publishedYear: 1951,
      categoryId: 'cat-liturgical',
      fileId: 'file-003',
      rightsId: 'rights-pub-001',
      churchId: 'patriarchate',
      createdById: 'user-admin-001',
      approvedById: 'user-reviewer-001',
      publishedAt: '2026-01-01T00:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      translations: [
        {
          id: 'trans-qed-am',
          bookId: 'book-qeddase-01',
          locale: 'am',
          title: 'መጽሐፈ ቅዳሴ (ካህንና ዲያቆን የሚተባበሩበት)',
          description: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን አሥራ አራቱ ቅዳሴያት ከነትርጓሜያቸው።',
          author: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን',
          publisher: 'ብርሃንና ሰላም ማተሚያ ቤት',
        },
        {
          id: 'trans-qed-gez',
          bookId: 'book-qeddase-01',
          locale: 'gez',
          title: 'መጽሐፈ ቊርባን ወቅዳሴ',
          description: 'ሥርዓተ ቊርባን ዘሠለስቱ ምዕት ወዐሠርቱ ወአርባዕቱ ቅዳሴያት።',
          author: 'ቅዱሳን ሐዋርያት',
          publisher: 'ማኅተመ መንበረ ፓትሪያርክ',
        },
        {
          id: 'trans-qed-en',
          bookId: 'book-qeddase-01',
          locale: 'en',
          title: 'The Book of the Divine Liturgy (Anaphoras)',
          description: 'The fourteen canonical anaphoras with Ge\'ez, Amharic, and English facing pages.',
          author: 'EOTC Holy Synod',
          publisher: 'Patriarchate Publishing House',
        },
      ],
      rights: {
        id: 'rights-pub-001',
        status: RightsStatus.PUBLIC_DOMAIN,
        rightsHolder: 'EOTC Patriarchate Tradition',
        source: 'Ancient Liturgical Manuscripts (Axum & Lalibela)',
        permissionReference: 'Canon Law of the Apostles',
        downloadAllowed: true,
        notes: 'Ancient manuscripts freely viewable and downloadable.',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    },
    {
      id: 'book-haymanot-02',
      slug: 'haymanote-abew',
      status: ContentStatus.PUBLISHED,
      author: 'Early Church Fathers',
      publishedYear: 1967,
      categoryId: 'cat-patristic',
      fileId: 'file-004',
      rightsId: 'rights-pub-001',
      churchId: 'patriarchate',
      createdById: 'user-admin-001',
      approvedById: 'user-reviewer-001',
      publishedAt: '2026-01-05T00:00:00.000Z',
      createdAt: '2026-01-02T00:00:00.000Z',
      updatedAt: '2026-01-05T00:00:00.000Z',
      translations: [
        {
          id: 'trans-hay-am',
          bookId: 'book-haymanot-02',
          locale: 'am',
          title: 'ሃይማኖተ አበው (የአበው ሃይማኖት ምስክርነት)',
          description: 'የሊቃውንተ ቤተክርስቲያን ኦርቶዶክሳዊ ተዋሕዶ ሃይማኖት ትምህርት እና የሃይማኖት ቀኖና።',
          author: 'የተዋሕዶ አባቶች',
          publisher: 'ትንሣኤ ዘጉባኤ ማተሚያ ቤት',
        },
        {
          id: 'trans-hay-gez',
          bookId: 'book-haymanot-02',
          locale: 'gez',
          title: 'ሃይማኖተ አበው ቅዱሳን',
          description: 'ነገረ ሃይማኖት ዘአበው ቀደምት ምስለ ትርጓሜሁ።',
          author: 'አበው ሊቃውንት',
          publisher: 'መንበረ ፓትሪያርክ',
        },
        {
          id: 'trans-hay-en',
          bookId: 'book-haymanot-02',
          locale: 'en',
          title: 'Faith of the Fathers (Haymanote Abew)',
          description: 'Patristic theology and Christology defended across the Ecumenical Councils.',
          author: 'Orthodox Church Fathers',
          publisher: 'Tensae Publishing',
        },
      ],
      rights: {
        id: 'rights-pub-001',
        status: RightsStatus.PUBLIC_DOMAIN,
        rightsHolder: 'EOTC Patriarchate Tradition',
        downloadAllowed: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    },
    {
      id: 'book-sinkisar-03',
      slug: 'metsehafe-sinkisar',
      status: ContentStatus.IN_REVIEW,
      author: 'Abba Michael of Atrib & Church Scribes',
      publishedYear: 1990,
      categoryId: 'cat-monastic',
      fileId: 'file-005',
      rightsId: 'rights-ch-002',
      churchId: 'debre-libanos',
      createdById: 'user-editor-001',
      createdAt: '2026-02-01T00:00:00.000Z',
      updatedAt: '2026-02-01T00:00:00.000Z',
      translations: [
        {
          id: 'trans-sin-am',
          bookId: 'book-sinkisar-03',
          locale: 'am',
          title: 'መጽሐፈ ስንክሳር (የ365 ቀናት የቅዱሳን ታሪክ)',
          description: 'በየዕለቱ የሚነበብ የቅዱሳን፣ የጻድቃን፣ የሰማዕታትና የመላእክት በዓላት ታሪክ።',
          author: 'አባ ሚካኤል ዘአትሪብ',
          publisher: 'ማኅበረ ቅዱሳን',
        },
        {
          id: 'trans-sin-en',
          bookId: 'book-sinkisar-03',
          locale: 'en',
          title: 'The Ethiopian Synaxarium (Book of Saints)',
          description: 'Daily commemorative hagiographies of the Christian martyrs and holy ascetics.',
          author: 'Abba Michael of Atrib',
          publisher: 'Mahibere Kidusan',
        },
      ],
      rights: {
        id: 'rights-ch-002',
        status: RightsStatus.CHURCH_OWNED,
        rightsHolder: 'Debre Libanos Monastery',
        downloadAllowed: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    },
    {
      id: 'book-weddase-04',
      slug: 'weddase-maryam',
      status: ContentStatus.DRAFT,
      author: 'Saint Ephrem the Syrian & Saint Yared',
      publishedYear: 2005,
      categoryId: 'cat-liturgical',
      fileId: 'file-006',
      rightsId: 'rights-pub-001',
      churchId: 'debre-libanos',
      createdById: 'user-editor-001',
      createdAt: '2026-02-10T00:00:00.000Z',
      updatedAt: '2026-02-10T00:00:00.000Z',
      translations: [
        {
          id: 'trans-wed-am',
          bookId: 'book-weddase-04',
          locale: 'am',
          title: 'ውዳሴ ማርያም ከነትርጓሜው',
          description: 'የሰባቱ ቀናት ውዳሴ ማርያምና አንቀጸ ብርሃን ምስለ ምስባክ።',
          author: 'ቅዱስ ኤፍሬም ሶርያዊ',
          publisher: 'ትንሣኤ ማተሚያ ድርጅት',
        },
        {
          id: 'trans-wed-gez',
          bookId: 'book-weddase-04',
          locale: 'gez',
          title: 'ውዳሴ ማርያም ወአንቀጸ ብርሃን',
          description: 'ጸሎት ወስብሐት ዘሰቡዕ ዕለታት።',
          author: 'ቅዱስ ኤፍሬም ሶርያዊ',
          publisher: 'ማኅተመ መንበረ ፓትሪያርክ',
        },
      ],
      rights: {
        id: 'rights-pub-001',
        status: RightsStatus.PUBLIC_DOMAIN,
        rightsHolder: 'EOTC Patriarchate Tradition',
        downloadAllowed: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  // 1. Get Categories
  async getCategories(): Promise<CategoryDto[]> {
    try {
      const dbCategories = await this.prisma.category.findMany({
        include: { _count: { select: { books: true } } },
      });
      if (dbCategories && dbCategories.length > 0) {
        return dbCategories.map((c) => ({
          id: c.id,
          slug: c.slug,
          nameAm: c.nameAm,
          nameGez: c.nameGez || c.nameAm,
          nameEn: c.nameEn,
          bookCount: c._count.books,
        }));
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable for categories: ${(err as Error).message}`);
    }
    return this.canonicalCategories;
  }

  // 2. Find All Books (with filtering)
  async findAll(options?: {
    status?: ContentStatus;
    categoryId?: string;
    churchId?: string;
    locale?: string;
    search?: string;
    isStaff?: boolean;
  }): Promise<BookDto[]> {
    // If not staff, default to PUBLISHED only
    const targetStatus = options?.isStaff ? options.status : ContentStatus.PUBLISHED;

    try {
      const where: any = {};
      if (targetStatus) where.status = targetStatus;
      if (options?.categoryId) where.categoryId = options.categoryId;

      const dbBooks = await this.prisma.book.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          translations: true,
          category: true,
          rights: true,
          file: true,
        },
      });

      if (dbBooks && dbBooks.length > 0) {
        return dbBooks.map((b) => this.mapBookDto(b));
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable for books findAll: ${(err as Error).message}`);
    }

    // In-Memory filtering
    return this.memoryBooks.filter((b) => {
      if (targetStatus && b.status !== targetStatus) return false;
      if (options?.categoryId && b.categoryId !== options.categoryId) return false;
      if (options?.churchId && b.churchId !== options.churchId) return false;
      if (options?.search) {
        const query = options.search.toLowerCase();
        const matchesTitle = b.translations.some(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            t.description?.toLowerCase().includes(query),
        );
        const matchesSlug = b.slug.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSlug) return false;
      }
      return true;
    });
  }

  // 3. Find One Book by ID or Slug
  async findOne(idOrSlug: string, locale?: string): Promise<BookDto> {
    try {
      const book = await this.prisma.book.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
        include: {
          translations: true,
          category: true,
          rights: true,
          file: true,
        },
      });

      if (book) {
        return this.mapBookDto(book);
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable for findOne: ${(err as Error).message}`);
    }

    const found = this.memoryBooks.find(
      (b) => b.id === idOrSlug || b.slug === idOrSlug,
    );
    if (!found) {
      throw new NotFoundException(`Book '${idOrSlug}' not found.`);
    }

    return found;
  }

  // 4. Create Book (DRAFT status by default)
  async create(dto: CreateBookInputDto, actorId?: string): Promise<BookDto> {
    // Validate translations
    if (!dto.translations || dto.translations.length === 0) {
      throw new BadRequestException('At least one translation is required.');
    }

    try {
      const created = await this.prisma.book.create({
        data: {
          slug: dto.slug,
          categoryId: dto.categoryId,
          fileId: dto.fileId,
          rightsId: dto.rightsId,
          publicationYear: dto.publishedYear,
          status: ContentStatus.DRAFT,
          translations: {
            create: dto.translations.map((t) => ({
              locale: t.locale,
              title: t.title,
              description: t.description,
              authorDisplayName: t.author || dto.author,
            })),
          },
        },
        include: {
          translations: true,
          category: true,
          rights: true,
          file: true,
        },
      });

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_CREATED,
        entityType: 'Book',
        entityId: created.id,
        metadata: { slug: created.slug, status: created.status },
      });

      return this.mapBookDto(created);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, creating book in memory: ${(err as Error).message}`);
      const newBook: BookDto = {
        id: `book-${Date.now()}`,
        slug: dto.slug,
        status: ContentStatus.DRAFT,
        author: dto.author,
        publishedYear: dto.publishedYear,
        fileId: dto.fileId,
        rightsId: dto.rightsId,
        coverImageId: dto.coverImageId,
        churchId: dto.churchId,
        categoryId: dto.categoryId,
        createdById: actorId,
        translations: dto.translations.map((t, idx) => ({
          id: `trans-${Date.now()}-${idx}`,
          locale: t.locale,
          title: t.title,
          description: t.description,
          author: t.author || dto.author,
          publisher: t.publisher,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.memoryBooks.unshift(newBook);

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_CREATED,
        entityType: 'Book',
        entityId: newBook.id,
        metadata: { slug: newBook.slug, status: newBook.status },
      });

      return newBook;
    }
  }

  // 5. Update Book
  async update(id: string, dto: UpdateBookInputDto, actorId?: string): Promise<BookDto> {
    const existing = await this.findOne(id);

    try {
      const updated = await this.prisma.book.update({
        where: { id: existing.id },
        data: {
          slug: dto.slug,
          categoryId: dto.categoryId,
          fileId: dto.fileId,
          rightsId: dto.rightsId,
          publicationYear: dto.publishedYear,
        },
        include: {
          translations: true,
          category: true,
          rights: true,
          file: true,
        },
      });

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_UPDATED,
        entityType: 'Book',
        entityId: updated.id,
        metadata: { slug: updated.slug },
      });

      return this.mapBookDto(updated);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, updating book in memory: ${(err as Error).message}`);
      const idx = this.memoryBooks.findIndex((b) => b.id === existing.id);
      if (idx !== -1) {
        this.memoryBooks[idx] = {
          ...this.memoryBooks[idx],
          slug: dto.slug ?? this.memoryBooks[idx].slug,
          author: dto.author ?? this.memoryBooks[idx].author,
          publishedYear: dto.publishedYear ?? this.memoryBooks[idx].publishedYear,
          fileId: dto.fileId ?? this.memoryBooks[idx].fileId,
          rightsId: dto.rightsId ?? this.memoryBooks[idx].rightsId,
          categoryId: dto.categoryId ?? this.memoryBooks[idx].categoryId,
          churchId: dto.churchId ?? this.memoryBooks[idx].churchId,
          updatedAt: new Date().toISOString(),
        };

        if (dto.translations && dto.translations.length > 0) {
          this.memoryBooks[idx].translations = dto.translations.map((t, i) => ({
            id: `trans-${Date.now()}-${i}`,
            bookId: existing.id,
            locale: t.locale,
            title: t.title,
            description: t.description,
            author: t.author,
            publisher: t.publisher,
          }));
        }

        await this.auditService.record({
          actorId,
          action: AuditAction.CONTENT_UPDATED,
          entityType: 'Book',
          entityId: existing.id,
          metadata: { slug: this.memoryBooks[idx].slug },
        });

        return this.memoryBooks[idx];
      }
      throw new NotFoundException(`Book '${id}' not found.`);
    }
  }

  // 6. Workflow State Machine Transitions (DRAFT -> IN_REVIEW -> APPROVED -> PUBLISHED -> ARCHIVED)
  async transitionStatus(
    id: string,
    dto: TransitionBookDto,
    actor: { id?: string; role?: string },
  ): Promise<BookDto> {
    const book = await this.findOne(id);
    const currentStatus = book.status;
    const targetStatus = dto.targetStatus;

    if (currentStatus === targetStatus) {
      return book;
    }

    // Rule 1: Separation of Duties (Section 3 & 14)
    // Creator cannot approve their own submission
    if (
      targetStatus === ContentStatus.APPROVED &&
      book.createdById &&
      actor.id &&
      book.createdById === actor.id &&
      actor.role !== 'SUPER_ADMINISTRATOR'
    ) {
      throw new ForbiddenException(
        'Separation of duties violation: Creators are not permitted to approve their own submissions.',
      );
    }

    // Rule 2: Publication Pre-Requisites (Section 14 & 34)
    if (targetStatus === ContentStatus.PUBLISHED) {
      // Must have linked file
      if (!book.fileId) {
        throw new BadRequestException(
          'Cannot publish book without an attached manuscript file.',
        );
      }

      // Must have valid rights record
      if (!book.rightsId) {
        throw new BadRequestException(
          'Cannot publish book without an associated Rights & Provenance record.',
        );
      }

      if (book.rights?.status === RightsStatus.UNKNOWN) {
        throw new BadRequestException(
          'Cannot publish book with UNKNOWN rights status. Legal provenance must be verified.',
        );
      }

      // Must have at least one primary title (Amharic or Ge'ez)
      const hasPrimary = book.translations.some(
        (t) => (t.locale === 'am' || t.locale === 'gez') && t.title.trim().length > 0,
      );
      if (!hasPrimary) {
        throw new BadRequestException(
          'Publication requires at least one verified primary translation in Amharic (am) or Ge\'ez (gez).',
        );
      }
    }

    // State machine allowable pathways
    const allowableTransitions: Record<ContentStatus, ContentStatus[]> = {
      [ContentStatus.DRAFT]: [ContentStatus.IN_REVIEW, ContentStatus.ARCHIVED],
      [ContentStatus.IN_REVIEW]: [
        ContentStatus.APPROVED,
        ContentStatus.REJECTED,
        ContentStatus.DRAFT,
      ],
      [ContentStatus.REJECTED]: [ContentStatus.DRAFT, ContentStatus.ARCHIVED],
      [ContentStatus.APPROVED]: [
        ContentStatus.PUBLISHED,
        ContentStatus.DRAFT,
        ContentStatus.ARCHIVED,
      ],
      [ContentStatus.PUBLISHED]: [ContentStatus.ARCHIVED],
      [ContentStatus.ARCHIVED]: [ContentStatus.DRAFT],
    };

    const allowed = allowableTransitions[currentStatus] || [];
    if (!allowed.includes(targetStatus) && actor.role !== 'SUPER_ADMINISTRATOR') {
      throw new BadRequestException(
        `Invalid status transition from '${currentStatus}' to '${targetStatus}'.`,
      );
    }

    // Perform update
    const updateData: any = { status: targetStatus };
    if (targetStatus === ContentStatus.APPROVED) {
      updateData.approvedById = actor.id;
    }
    if (targetStatus === ContentStatus.PUBLISHED) {
      updateData.publishedAt = new Date().toISOString();
    }

    try {
      const updated = await this.prisma.book.update({
        where: { id: book.id },
        data: {
          status: targetStatus,
        },
        include: {
          translations: true,
          category: true,
          rights: true,
          file: true,
        },
      });

      const auditAction =
        targetStatus === ContentStatus.IN_REVIEW
          ? AuditAction.CONTENT_SUBMITTED
          : targetStatus === ContentStatus.APPROVED
          ? AuditAction.CONTENT_APPROVED
          : targetStatus === ContentStatus.REJECTED
          ? AuditAction.CONTENT_REJECTED
          : targetStatus === ContentStatus.PUBLISHED
          ? AuditAction.CONTENT_PUBLISHED
          : targetStatus === ContentStatus.ARCHIVED
          ? AuditAction.CONTENT_ARCHIVED
          : AuditAction.CONTENT_UPDATED;

      await this.auditService.record({
        actorId: actor.id,
        action: auditAction,
        entityType: 'Book',
        entityId: updated.id,
        metadata: {
          fromStatus: currentStatus,
          toStatus: targetStatus,
          comment: dto.comment,
        },
      });

      return this.mapBookDto(updated);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, transitioning book in memory: ${(err as Error).message}`);
      const idx = this.memoryBooks.findIndex((b) => b.id === book.id);
      if (idx !== -1) {
        this.memoryBooks[idx] = {
          ...this.memoryBooks[idx],
          status: targetStatus,
          approvedById:
            targetStatus === ContentStatus.APPROVED
              ? actor.id
              : this.memoryBooks[idx].approvedById,
          publishedAt:
            targetStatus === ContentStatus.PUBLISHED
              ? new Date().toISOString()
              : this.memoryBooks[idx].publishedAt,
          updatedAt: new Date().toISOString(),
        };

        const auditAction =
          targetStatus === ContentStatus.IN_REVIEW
            ? AuditAction.CONTENT_SUBMITTED
            : targetStatus === ContentStatus.APPROVED
            ? AuditAction.CONTENT_APPROVED
            : targetStatus === ContentStatus.REJECTED
            ? AuditAction.CONTENT_REJECTED
            : targetStatus === ContentStatus.PUBLISHED
            ? AuditAction.CONTENT_PUBLISHED
            : targetStatus === ContentStatus.ARCHIVED
            ? AuditAction.CONTENT_ARCHIVED
            : AuditAction.CONTENT_UPDATED;

        await this.auditService.record({
          actorId: actor.id,
          action: auditAction,
          entityType: 'Book',
          entityId: book.id,
          metadata: {
            fromStatus: currentStatus,
            toStatus: targetStatus,
            comment: dto.comment,
          },
        });

        return this.memoryBooks[idx];
      }
      throw new NotFoundException(`Book '${id}' not found.`);
    }
  }

  private mapBookDto(b: any): BookDto {
    return {
      id: b.id,
      slug: b.slug,
      status: b.status as ContentStatus,
      author: b.author,
      publishedYear: b.publicationYear,
      fileId: b.fileId,
      rightsId: b.rightsId,
      coverImageId: b.coverMediaId,
      churchId: b.sourceId,
      categoryId: b.categoryId,
      createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : String(b.createdAt),
      updatedAt: b.updatedAt instanceof Date ? b.updatedAt.toISOString() : String(b.updatedAt),
      translations: Array.isArray(b.translations)
        ? b.translations.map((t: any) => ({
            id: t.id,
            bookId: t.bookId,
            locale: t.locale,
            title: t.title,
            description: t.description,
            author: t.authorDisplayName,
          }))
        : [],
      category: b.category
        ? {
            id: b.category.id,
            slug: b.category.slug,
            nameAm: b.category.nameAm,
            nameGez: b.category.nameGez || b.category.nameAm,
            nameEn: b.category.nameEn,
          }
        : undefined,
      rights: b.rights
        ? {
            id: b.rights.id,
            status: b.rights.status as RightsStatus,
            rightsHolder: b.rights.rightsHolder,
            source: b.rights.source,
            permissionReference: b.rights.permissionReference,
            downloadAllowed: b.rights.downloadAllowed,
            notes: b.rights.notes,
            createdAt: b.rights.createdAt instanceof Date ? b.rights.createdAt.toISOString() : String(b.rights.createdAt),
            updatedAt: b.rights.updatedAt instanceof Date ? b.rights.updatedAt.toISOString() : String(b.rights.updatedAt),
          }
        : undefined,
      file: b.file
        ? {
            id: b.file.id,
            objectKey: b.file.objectKey,
            originalName: b.file.originalName,
            mimeType: b.file.mimeType,
            bytes: Number(b.file.bytes),
            checksum: b.file.checksum,
            status: b.file.status,
            createdAt: b.file.createdAt instanceof Date ? b.file.createdAt.toISOString() : String(b.file.createdAt),
          }
        : undefined,
    };
  }
}
