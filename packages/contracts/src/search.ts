export type SearchResultType = 'BOOK' | 'MEZMUR' | 'ARTICLE' | 'CHURCH' | 'EVENT';

export interface SearchResultItemDto {
  id: string;
  type: SearchResultType;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  locale?: string;
  url: string;
  category?: string;
  relevanceScore: number;
  metadata?: Record<string, any>;
}

export interface SearchResponseDto {
  query: string;
  total: number;
  results: SearchResultItemDto[];
  countsByType: {
    BOOK: number;
    MEZMUR: number;
    ARTICLE: number;
    CHURCH: number;
    EVENT: number;
  };
}

export interface SearchQueryDto {
  q: string;
  type?: SearchResultType | 'ALL';
  locale?: string;
  limit?: number;
  offset?: number;
}
