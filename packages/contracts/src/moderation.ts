import { ModerationType, ModerationStatus, ModerationPriority } from './enums';

export interface ModerationProposedChanges {
  field?: string;
  originalText?: string;
  correctedText?: string;
  rationale?: string;
  [key: string]: any;
}

export interface ModerationItemDto {
  id: string;
  type: ModerationType;
  status: ModerationStatus;
  priority: ModerationPriority;
  targetEntityType: string; // 'CHURCH', 'BOOK', 'MEZMUR', 'ARTICLE'
  targetEntityId: string;
  targetTitle: string;
  claimantUserId?: string;
  claimantName: string;
  claimantEmail: string;
  dioceseName?: string;
  officialDocumentUrl?: string;
  proposedChanges?: ModerationProposedChanges;
  moderatorNotes?: string;
  reviewedById?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateModerationItemDto {
  type: ModerationType;
  priority?: ModerationPriority;
  targetEntityType: string;
  targetEntityId: string;
  targetTitle: string;
  claimantUserId?: string;
  claimantName: string;
  claimantEmail: string;
  dioceseName?: string;
  officialDocumentUrl?: string;
  proposedChanges?: ModerationProposedChanges;
}

export interface ModerationActionDto {
  action: 'APPROVE' | 'REJECT' | 'RESOLVE' | 'IN_REVIEW';
  moderatorNotes?: string;
}

export interface ModerationStatsDto {
  totalPending: number;
  pendingClaims: number;
  pendingCorrections: number;
  pendingReports: number;
  totalResolved: number;
  recentActionsCount: number;
}
