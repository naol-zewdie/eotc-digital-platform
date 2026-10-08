import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { LoggingInterceptor } from './common/observability/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix per Section 17: /api/v1
  app.setGlobalPrefix('api/v1');

  // Appendix B error formatting
  app.useGlobalFilters(new ApiExceptionFilter());

  // Structured JSON logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Input validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS for public frontend
  app.enableCors({
    origin: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`EOTC Platform API Modular Monolith running on http://localhost:${port}/api/v1`);
  logger.log(`Health endpoint available at http://localhost:${port}/api/v1/health`);
}

bootstrap();
