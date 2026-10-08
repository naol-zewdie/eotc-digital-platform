import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditEventDto } from '@eotc/contracts';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async getAuditLogs(
    @Query('limit') limit?: string,
    @Query('entityType') entityType?: string,
  ): Promise<AuditEventDto[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    return this.auditService.findAll(parsedLimit, entityType);
  }
}
