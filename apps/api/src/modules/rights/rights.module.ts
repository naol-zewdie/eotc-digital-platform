import { Global, Module } from '@nestjs/common';
import { RightsService } from './rights.service';
import { RightsController } from './rights.controller';

@Global()
@Module({
  controllers: [RightsController],
  providers: [RightsService],
  exports: [RightsService],
})
export class RightsModule {}
