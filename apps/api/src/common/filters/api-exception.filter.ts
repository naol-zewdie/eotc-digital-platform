import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestWithId } from '../observability/request-id.middleware';
import { ApiErrorResponse, StandardErrorCode } from '@eotc/contracts';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithId>();

    const requestId = request?.requestId || 'unknown-request-id';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = StandardErrorCode.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected internal error occurred.';
    let details: Array<{ field?: string; reason: string }> | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const anyRes = res as any;
        message = anyRes.message || exception.message;
        code = anyRes.code || this.mapStatusToCode(status);

        if (Array.isArray(anyRes.message)) {
          // class-validator error array
          code = StandardErrorCode.VALIDATION_ERROR;
          message = 'Validation failed for the request payload.';
          details = anyRes.message.map((msg: string) => {
            const parts = msg.split(' ');
            return {
              field: parts[0] || 'input',
              reason: msg,
            };
          });
        } else if (anyRes.details) {
          details = anyRes.details;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorBody: ApiErrorResponse = {
      error: {
        code,
        message,
        requestId,
        ...(details && details.length > 0 ? { details } : {}),
      },
    };

    response.status(status).json(errorBody);
  }

  private mapStatusToCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return StandardErrorCode.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return StandardErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return StandardErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return StandardErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return StandardErrorCode.CONFLICT;
      case HttpStatus.TOO_MANY_REQUESTS:
        return StandardErrorCode.RATE_LIMITED;
      default:
        return StandardErrorCode.INTERNAL_SERVER_ERROR;
    }
  }
}
