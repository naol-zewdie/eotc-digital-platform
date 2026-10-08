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
  ArticleType,
  ContentStatus,
  AuditAction,
  ArticleDto,
  ArticleRevisionDto,
} from '@eotc/contracts';
import {
  CreateArticleInputDto,
  UpdateArticleInputDto,
  TransitionArticleDto,
} from './dto/editorial.dto';

@Injectable()
export class EditorialService {
  private readonly logger = new Logger(EditorialService.name);

  // In-memory canonical articles & revisions for development and offline testing
  private memoryArticles: ArticleDto[] = [
    {
      id: 'art-synod-01',
      slug: 'holy-synod-peace-declaration-2026',
      type: ArticleType.NEWS,
      status: ContentStatus.PUBLISHED,
      authorId: 'user-admin-001',
      authorName: 'Patriarchate Secretariat',
      churchId: 'patriarchate',
      publishedAt: '2026-01-20T00:00:00.000Z',
      viewCount: 4210,
      createdAt: '2026-01-18T00:00:00.000Z',
      updatedAt: '2026-01-20T00:00:00.000Z',
      translations: [
        {
          id: 'trans-art-syn-am',
          articleId: 'art-synod-01',
          locale: 'am',
          title: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ቅዱስ ሲኖዶስ ዓመታዊ የሰላምና አንድነት መግለጫ',
          summary: 'ቅዱስ ሲኖዶስ በወቅታዊ ሀገራዊና ዓለም አቀፋዊ ጉዳዮች ላይ ያወጣው ሰፊ መግለጫና ሐዋርያዊ ጥሪ።',
          contentMarkdown: `# የቅዱስ ሲኖዶስ ሐዋርያዊ መግለጫ

በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።

የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ቅዱስ ሲኖዶስ በዛሬው ዕለት ባካሄደው ምልዐተ ጉባኤ ለመላው የሀገራችን ሕዝቦችና በዓለም ዙሪያ ለሚገኙ ምእመናን የሰላም፣ የፍቅርና የአንድነት ጥሪውን አስተላልፏል።

## ዋና ዋና ውሳኔዎች
1. **ለተፈናቀሉ ወገኖች ድጋፍ**: በሁሉም አህጉረ ስብከት የሚገኙ አብያተ ክርስቲያናት ለተቸገሩ ወገኖች ሰብአዊ እርዳታ እንዲያደርሱ።
2. **የጥንታውያን ገዳማት ጥበቃ**: የታሪክና የሃይማኖት ማዕከል የሆኑ ገዳማትና የብራና ቅርሶች ደኅንነት እንዲጠበቅ።`,
        },
        {
          id: 'trans-art-syn-en',
          articleId: 'art-synod-01',
          locale: 'en',
          title: 'Holy Synod 2026 Canonical Proclamation on National Peace and Spiritual Unity',
          summary: 'Official pastoral communique from the Holy Synod calling for reconciliation and preservation of heritage.',
          contentMarkdown: `# Holy Synod Official Pastoral Proclamation

In the name of the Father, the Son, and the Holy Spirit, One God, Amen.

The Holy Synod of the Ethiopian Orthodox Tewahedo Church convened in plenary assembly issues an urgent appeal for spiritual unity, peace, and national reconciliation across all dioceses.`,
        },
      ],
      revisions: [
        {
          id: 'rev-01-01',
          articleId: 'art-synod-01',
          editorId: 'user-admin-001',
          editorName: 'Patriarchate Secretariat',
          diff: 'Initial drafting of synodal communique text.',
          comment: 'First official draft for review',
          createdAt: '2026-01-18T00:00:00.000Z',
        },
        {
          id: 'rev-01-02',
          articleId: 'art-synod-01',
          editorId: 'user-reviewer-001',
          editorName: 'Ecclesiastical Reviewer',
          diff: 'Editorial refinements on theological and canonical citations.',
          comment: 'Approved by Holy Synod secretariat for release',
          createdAt: '2026-01-20T00:00:00.000Z',
        },
      ],
    },
    {
      id: 'art-fasting-02',
      slug: 'orthodox-fasting-theology',
      type: ArticleType.ARTICLE,
      status: ContentStatus.PUBLISHED,
      authorId: 'user-editor-001',
      authorName: 'Department of Theodicy & Doctrine',
      publishedAt: '2026-02-01T00:00:00.000Z',
      viewCount: 1890,
      createdAt: '2026-01-28T00:00:00.000Z',
      updatedAt: '2026-02-01T00:00:00.000Z',
      translations: [
        {
          id: 'trans-art-fst-am',
          articleId: 'art-fasting-02',
          locale: 'am',
          title: 'የኦርቶዶክሳዊ ጾም መንፈሳዊ ትርጉምና ቀኖናዊ ሥርዓት በሊቃውንት አስተምህሮ',
          summary: 'ጾም የሥጋ ፈቃድን ለነፍስ ማስገዣና ወደ እግዚአብሔር የመቅረቢያ ሰማያዊ መንገድ መሆኑን የሚያትት ጥናት።',
          contentMarkdown: `# የኦርቶዶክሳዊ ጾም መንፈሳዊ ትርጉም

ጾም ማለት ሰው ለተወሰነ ጊዜ ከምግብና ከመጠጥ እንዲሁም ከክፉ ሥራዎች ሁሉ ተከልክሎ ራሱን ለእግዚአብሔር የሚያቀርብበት መንፈሳዊ መንገድ ነው።

## ሰባቱ አጽዋማት
በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ቀኖና መሠረት ሁሉም ምእመናን የሚጾሟቸው ሰባት አጽዋማት አሉ።`,
        },
        {
          id: 'trans-art-fst-en',
          articleId: 'art-fasting-02',
          locale: 'en',
          title: 'The Theology and Ascetic Discipline of Orthodox Fasting',
          summary: 'A theological treatise on fasting as the subjugation of carnal desires to the divine will.',
          contentMarkdown: `# The Theology of Ascetic Fasting

Fasting in the Orthodox Tewahedo tradition is not merely abstinence from certain foods, but the sanctification of the senses and prayerful communion with God.`,
        },
      ],
      revisions: [
        {
          id: 'rev-02-01',
          articleId: 'art-fasting-02',
          editorId: 'user-editor-001',
          editorName: 'Theological Editor',
          diff: 'Initial publication draft.',
          comment: 'Canonically referenced patristic study',
          createdAt: '2026-01-28T00:00:00.000Z',
        },
      ],
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  // 1. Find all articles with filters
  async findAll(options?: {
    type?: ArticleType;
    status?: ContentStatus;
    churchId?: string;
    search?: string;
    isStaff?: boolean;
  }): Promise<ArticleDto[]> {
    const targetStatus = options?.isStaff ? options.status : ContentStatus.PUBLISHED;

    try {
      const where: any = {};
      if (targetStatus) where.status = targetStatus;
      if (options?.type) where.type = options.type;
      if (options?.churchId) where.churchId = options.churchId;

      const dbArticles = await this.prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          translations: true,
          revisions: { orderBy: { createdAt: 'desc' }, include: { editor: true } },
          author: { select: { displayName: true } },
        },
      });

      if (dbArticles && dbArticles.length > 0) {
        return dbArticles.map((a) => this.mapArticleDto(a));
      }
    } catch (err) {
      this.logger.warn(`Prisma unavailable for findAll articles: ${(err as Error).message}`);
    }

    // In-memory fallback
    return this.memoryArticles.filter((a) => {
      if (targetStatus && a.status !== targetStatus) return false;
      if (options?.type && a.type !== options.type) return false;
      if (options?.churchId && a.churchId !== options.churchId) return false;
      if (options?.search) {
        const q = options.search.toLowerCase();
        const matchesSlug = a.slug.toLowerCase().includes(q);
        const matchesTitle = a.translations.some(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.summary?.toLowerCase().includes(q),
        );
        if (!matchesSlug && !matchesTitle) return false;
      }
      return true;
    });
  }

  // 2. Find one article
  async findOne(idOrSlug: string): Promise<ArticleDto> {
    try {
      const a = await this.prisma.article.findFirst({
        where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
        include: {
          translations: true,
          revisions: { orderBy: { createdAt: 'desc' }, include: { editor: true } },
          author: { select: { displayName: true } },
        },
      });
      if (a) return this.mapArticleDto(a);
    } catch (err) {
      this.logger.warn(`Prisma unavailable for findOne article: ${(err as Error).message}`);
    }

    const found = this.memoryArticles.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
    if (!found) throw new NotFoundException(`Article '${idOrSlug}' not found.`);
    return found;
  }

  // 3. Create Article
  async create(dto: CreateArticleInputDto, actorId?: string): Promise<ArticleDto> {
    if (!dto.translations || dto.translations.length === 0) {
      throw new BadRequestException('At least one translation with title is required.');
    }

    try {
      const created = await this.prisma.article.create({
        data: {
          slug: dto.slug,
          type: dto.type || ArticleType.ARTICLE,
          authorId: actorId,
          churchId: dto.churchId,
          status: ContentStatus.DRAFT,
          translations: {
            create: dto.translations.map((t) => ({
              locale: t.locale,
              title: t.title,
              summary: t.summary,
              body: t.contentMarkdown || t.contentHtml || t.summary || '',
            })),
          },
        },
        include: {
          translations: true,
          revisions: true,
        },
      });

      // Record initial revision snapshot if actorId is valid in DB
      if (actorId) {
        try {
          await this.prisma.articleRevision.create({
            data: {
              articleId: created.id,
              revisionNo: 1,
              editorId: actorId,
              snapshot: {
                comment: 'Initial draft',
                slug: created.slug,
              },
            },
          });
        } catch {}
      }

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_CREATED,
        entityType: 'Article',
        entityId: created.id,
        metadata: { slug: created.slug, type: created.type },
      });

      return this.mapArticleDto(created);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, saving article in memory: ${(err as Error).message}`);
      const newArticle: ArticleDto = {
        id: `art-${Date.now()}`,
        slug: dto.slug,
        type: dto.type || ArticleType.ARTICLE,
        status: ContentStatus.DRAFT,
        authorId: actorId,
        churchId: dto.churchId,
        coverMediaId: dto.coverMediaId,
        viewCount: 0,
        translations: dto.translations.map((t, idx) => ({
          id: `trans-art-${Date.now()}-${idx}`,
          locale: t.locale,
          title: t.title,
          summary: t.summary,
          contentMarkdown: t.contentMarkdown,
          contentHtml: t.contentHtml,
        })),
        revisions: [
          {
            id: `rev-${Date.now()}`,
            articleId: `art-${Date.now()}`,
            editorId: actorId,
            diff: 'Initial article creation',
            comment: 'Initial draft',
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.memoryArticles.unshift(newArticle);

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_CREATED,
        entityType: 'Article',
        entityId: newArticle.id,
        metadata: { slug: newArticle.slug, type: newArticle.type },
      });

      return newArticle;
    }
  }

  // 4. Update Article with Revision History Tracking
  async update(id: string, dto: UpdateArticleInputDto, actorId?: string): Promise<ArticleDto> {
    const existing = await this.findOne(id);

    try {
      const updated = await this.prisma.article.update({
        where: { id: existing.id },
        data: {
          slug: dto.slug,
          type: dto.type,
          churchId: dto.churchId,
        },
        include: {
          translations: true,
          revisions: true,
        },
      });

      if (actorId) {
        try {
          const revCount = await this.prisma.articleRevision.count({
            where: { articleId: existing.id },
          });

          await this.prisma.articleRevision.create({
            data: {
              articleId: existing.id,
              revisionNo: revCount + 1,
              editorId: actorId,
              snapshot: {
                comment: dto.revisionComment || 'Editorial revisions',
                updatedAt: new Date().toISOString(),
              },
            },
          });
        } catch {}
      }

      await this.auditService.record({
        actorId,
        action: AuditAction.CONTENT_UPDATED,
        entityType: 'Article',
        entityId: updated.id,
        metadata: { slug: updated.slug, comment: dto.revisionComment },
      });

      return this.mapArticleDto(updated);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, updating article in memory: ${(err as Error).message}`);
      const idx = this.memoryArticles.findIndex((a) => a.id === existing.id);
      if (idx !== -1) {
        this.memoryArticles[idx] = {
          ...this.memoryArticles[idx],
          slug: dto.slug ?? this.memoryArticles[idx].slug,
          type: dto.type ?? this.memoryArticles[idx].type,
          churchId: dto.churchId ?? this.memoryArticles[idx].churchId,
          coverMediaId: dto.coverMediaId ?? this.memoryArticles[idx].coverMediaId,
          updatedAt: new Date().toISOString(),
        };

        if (dto.translations && dto.translations.length > 0) {
          this.memoryArticles[idx].translations = dto.translations.map((t, i) => ({
            id: `trans-art-${Date.now()}-${i}`,
            articleId: existing.id,
            locale: t.locale,
            title: t.title,
            summary: t.summary,
            contentMarkdown: t.contentMarkdown,
            contentHtml: t.contentHtml,
          }));
        }

        // Add revision to history
        if (!this.memoryArticles[idx].revisions) this.memoryArticles[idx].revisions = [];
        this.memoryArticles[idx].revisions!.unshift({
          id: `rev-${Date.now()}`,
          articleId: existing.id,
          editorId: actorId,
          diff: `Updated metadata & translations for ${existing.slug}`,
          comment: dto.revisionComment || 'Editorial revisions',
          createdAt: new Date().toISOString(),
        });

        await this.auditService.record({
          actorId,
          action: AuditAction.CONTENT_UPDATED,
          entityType: 'Article',
          entityId: existing.id,
          metadata: { slug: this.memoryArticles[idx].slug, comment: dto.revisionComment },
        });

        return this.memoryArticles[idx];
      }
      throw new NotFoundException(`Article '${id}' not found.`);
    }
  }

  // 5. Get Revision History
  async getRevisions(id: string): Promise<ArticleRevisionDto[]> {
    const article = await this.findOne(id);
    return article.revisions || [];
  }

  // 6. Transition Article Status
  async transitionStatus(
    id: string,
    dto: TransitionArticleDto,
    actor: { id?: string; role?: string },
  ): Promise<ArticleDto> {
    const article = await this.findOne(id);
    const targetStatus = dto.targetStatus;

    if (article.status === targetStatus) return article;

    // Separation of Duties: Creator cannot approve their own article
    if (
      targetStatus === ContentStatus.APPROVED &&
      article.authorId &&
      actor.id &&
      article.authorId === actor.id &&
      actor.role !== 'SUPER_ADMINISTRATOR'
    ) {
      throw new ForbiddenException(
        'Separation of duties violation: Authors are not permitted to approve their own articles.',
      );
    }

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

    try {
      const updated = await this.prisma.article.update({
        where: { id: article.id },
        data: {
          status: targetStatus,
          publishedAt: targetStatus === ContentStatus.PUBLISHED ? new Date().toISOString() : undefined,
        },
        include: {
          translations: true,
          revisions: { orderBy: { createdAt: 'desc' } },
        },
      });

      await this.auditService.record({
        actorId: actor.id,
        action: auditAction,
        entityType: 'Article',
        entityId: updated.id,
        metadata: { fromStatus: article.status, toStatus: targetStatus, comment: dto.comment },
      });

      return this.mapArticleDto(updated);
    } catch (err) {
      this.logger.warn(`Prisma unavailable, transitioning article in memory: ${(err as Error).message}`);
      const idx = this.memoryArticles.findIndex((a) => a.id === article.id);
      if (idx !== -1) {
        this.memoryArticles[idx] = {
          ...this.memoryArticles[idx],
          status: targetStatus,
          publishedAt: targetStatus === ContentStatus.PUBLISHED ? new Date().toISOString() : this.memoryArticles[idx].publishedAt,
          updatedAt: new Date().toISOString(),
        };

        await this.auditService.record({
          actorId: actor.id,
          action: auditAction,
          entityType: 'Article',
          entityId: article.id,
          metadata: { fromStatus: article.status, toStatus: targetStatus, comment: dto.comment },
        });

        return this.memoryArticles[idx];
      }
      throw new NotFoundException(`Article '${id}' not found.`);
    }
  }

  private mapArticleDto(a: any): ArticleDto {
    return {
      id: a.id,
      slug: a.slug,
      type: a.type as ArticleType,
      status: a.status as ContentStatus,
      authorId: a.authorId,
      authorName: a.author?.displayName,
      churchId: a.churchId,
      coverMediaId: a.coverMediaId,
      publishedAt: a.publishedAt instanceof Date ? a.publishedAt.toISOString() : a.publishedAt,
      viewCount: a.viewCount ?? 0,
      createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : String(a.createdAt),
      updatedAt: a.updatedAt instanceof Date ? a.updatedAt.toISOString() : String(a.updatedAt),
      translations: Array.isArray(a.translations)
        ? a.translations.map((t: any) => ({
            id: t.id,
            articleId: t.articleId,
            locale: t.locale,
            title: t.title,
            summary: t.summary,
            contentMarkdown: t.body,
            contentHtml: t.body,
          }))
        : [],
      revisions: Array.isArray(a.revisions)
        ? a.revisions.map((r: any) => ({
            id: r.id,
            articleId: r.articleId,
            editorId: r.editorId,
            editorName: r.editor?.displayName,
            diff: typeof r.snapshot === 'object' ? r.snapshot?.diff : undefined,
            comment: typeof r.snapshot === 'object' ? r.snapshot?.comment : undefined,
            createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
          }))
        : [],
    };
  }
}
