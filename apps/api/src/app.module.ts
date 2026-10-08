import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { IdentityModule } from './modules/identity/identity.module';
import { ChurchesModule } from './modules/churches/churches.module';
import { LibraryModule } from './modules/library/library.module';
import { MezmurModule } from './modules/mezmur/mezmur.module';
import { EditorialModule } from './modules/editorial/editorial.module';
import { EventsModule } from './modules/events/events.module';
import { MediaModule } from './modules/media/media.module';
import { DonationsModule } from './modules/donations/donations.module';
import { SearchModule } from './modules/search/search.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { AuditModule } from './modules/audit/audit.module';
import { StorageModule } from './common/storage/storage.module';
import { RightsModule } from './modules/rights/rights.module';
import { RequestIdMiddleware } from './common/observability/request-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    HealthModule,
    IdentityModule,
    ChurchesModule,
    LibraryModule,
    MezmurModule,
    EditorialModule,
    EventsModule,
    MediaModule,
    DonationsModule,
    SearchModule,
    ModerationModule,
    AuditModule,
    StorageModule,
    RightsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
