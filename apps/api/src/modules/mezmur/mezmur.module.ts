import { Module } from '@nestjs/common';
import { MezmurController } from './mezmur.controller';
import { MezmurService } from './mezmur.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [MezmurController],
  providers: [MezmurService],
  exports: [MezmurService],
})
export class MezmurModule {}
