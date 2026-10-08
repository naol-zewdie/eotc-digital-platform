import { IsString, IsOptional, IsIn, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { SearchResultType } from '@eotc/contracts';

export class SearchQueryDto {
  @IsString()
  q: string;

  @IsOptional()
  @IsIn(['ALL', 'BOOK', 'MEZMUR', 'ARTICLE', 'CHURCH', 'EVENT'])
  type?: SearchResultType | 'ALL';

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;
}
