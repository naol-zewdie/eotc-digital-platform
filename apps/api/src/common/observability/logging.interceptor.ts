import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestWithId } from './request-id.middleware';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithId>();
    const response = http.getResponse();

    const { method, originalUrl, requestId } = request;

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          const statusCode = response.statusCode;
          const logPayload = {
            timestamp: new Date().toISOString(),
            level: 'INFO',
            service: 'eotc-api',
            requestId: requestId || 'unknown',
            method,
            route: originalUrl,
            status: statusCode,
            durationMs: duration,
          };
          this.logger.log(JSON.stringify(logPayload));
        },
        error: (err) => {
          const duration = Date.now() - start;
          const statusCode = err.status || 500;
          const logPayload = {
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            service: 'eotc-api',
            requestId: requestId || 'unknown',
            method,
            route: originalUrl,
            status: statusCode,
            durationMs: duration,
            errorMessage: err.message,
          };
          this.logger.error(JSON.stringify(logPayload));
        },
      }),
    );
  }
}
