import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SystemHealthStatus } from '@eotc/contracts';

@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check(): Promise<SystemHealthStatus> {
    let dbStatus: 'up' | 'down' = 'up';
    let dbResponseTimeMs = 0;
    let dbError: string | undefined = undefined;

    const dbStart = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbResponseTimeMs = Date.now() - dbStart;
    } catch (err) {
      dbStatus = 'down';
      dbResponseTimeMs = Date.now() - dbStart;
      dbError = (err as Error).message;
    }

    const isHealthy = dbStatus === 'up';

    return {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        database: {
          status: dbStatus,
          responseTimeMs: dbResponseTimeMs,
          ...(dbError ? { error: dbError } : {}),
        },
      },
    };
  }
}
