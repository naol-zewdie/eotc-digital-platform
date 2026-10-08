export enum AuditAction {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  USER_REGISTERED = 'USER_REGISTERED',
  CONTENT_CREATED = 'CONTENT_CREATED',
  CONTENT_UPDATED = 'CONTENT_UPDATED',
  CONTENT_SUBMITTED = 'CONTENT_SUBMITTED',
  CONTENT_APPROVED = 'CONTENT_APPROVED',
  CONTENT_REJECTED = 'CONTENT_REJECTED',
  CONTENT_PUBLISHED = 'CONTENT_PUBLISHED',
  CONTENT_ARCHIVED = 'CONTENT_ARCHIVED',
  CHURCH_SCOPE_ASSIGNED = 'CHURCH_SCOPE_ASSIGNED',
  CHURCH_SCOPE_VERIFIED = 'CHURCH_SCOPE_VERIFIED',
  ROLE_UPDATED = 'ROLE_UPDATED',
  PERMISSION_CHECK_FAILED = 'PERMISSION_CHECK_FAILED',
}

export interface AuditEventDto {
  id: string;
  actorId?: string | null;
  actorEmail?: string | null;
  actorName?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any> | null;
  ipHash?: string | null;
  createdAt: string;
}

export interface CreateAuditEventDto {
  actorId?: string;
  action: AuditAction | string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
  ipHash?: string;
}
