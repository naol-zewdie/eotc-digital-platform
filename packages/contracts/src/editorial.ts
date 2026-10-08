import { ContentStatus, ArticleType } from './enums';

export interface ArticleTranslationDto {
  id?: string;
  articleId?: string;
  locale: string;
  title: string;
  summary?: string | null;
  contentMarkdown?: string | null;
  contentHtml?: string | null;
}

export interface ArticleRevisionDto {
  id: string;
  articleId: string;
  editorId?: string | null;
  editorName?: string | null;
  diff?: string | null;
  comment?: string | null;
  createdAt: string;
}

export interface ArticleDto {
  id: string;
  slug: string;
  type: ArticleType;
  status: ContentStatus;
  authorId?: string | null;
  authorName?: string | null;
  churchId?: string | null;
  churchSlug?: string | null;
  coverMediaId?: string | null;
  coverMediaUrl?: string | null;
  publishedAt?: string | null;
  viewCount: number;
  translations: ArticleTranslationDto[];
  revisions?: ArticleRevisionDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleTranslationInput {
  locale: string;
  title: string;
  summary?: string;
  contentMarkdown?: string;
  contentHtml?: string;
}

export interface CreateArticleDto {
  slug: string;
  type?: ArticleType;
  churchId?: string;
  coverMediaId?: string;
  translations: CreateArticleTranslationInput[];
}

export interface UpdateArticleDto {
  slug?: string;
  type?: ArticleType;
  churchId?: string;
  coverMediaId?: string;
  revisionComment?: string;
  translations?: CreateArticleTranslationInput[];
}

export interface ArticleTransitionDto {
  targetStatus: ContentStatus;
  comment?: string;
}
