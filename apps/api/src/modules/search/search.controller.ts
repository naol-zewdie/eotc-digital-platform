import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search.dto';
import { SearchResponseDto } from '@eotc/contracts';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: SearchQueryDto,
  ): Promise<SearchResponseDto> {
    return this.searchService.search(query);
  }
}
