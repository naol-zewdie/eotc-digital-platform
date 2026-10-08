import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { LibraryModule } from '../library/library.module';
import { MezmurModule } from '../mezmur/mezmur.module';
import { EditorialModule } from '../editorial/editorial.module';
import { ChurchesModule } from '../churches/churches.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    LibraryModule,
    MezmurModule,
    EditorialModule,
    ChurchesModule,
    EventsModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
