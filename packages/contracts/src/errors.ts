export interface ApiErrorDetail {
  field?: string;
  reason: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  requestId: string;
  details?: ApiErrorDetail[];
}

export interface ApiErrorResponse {
  error: ApiErrorBody;
}

export enum StandardErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONTENT_NOT_PUBLISHABLE = 'CONTENT_NOT_PUBLISHABLE',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  SCOPE_UNAUTHORIZED = 'SCOPE_UNAUTHORIZED',
}
