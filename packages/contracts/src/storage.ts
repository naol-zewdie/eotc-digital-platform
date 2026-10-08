export interface StoredFileDto {
  id: string;
  objectKey: string;
  originalName: string;
  mimeType: string;
  bytes: number;
  checksum?: string | null;
  status: string;
  uploadedById?: string | null;
  createdAt: string;
  url?: string;
}

export interface MediaDto {
  id: string;
  objectKey: string;
  type: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  rightsId?: string | null;
  churchId?: string | null;
  articleId?: string | null;
  createdAt: string;
  url?: string;
  rights?: {
    status: string;
    rightsHolder?: string | null;
    downloadAllowed: boolean;
  };
}

export interface FileValidationResult {
  valid: boolean;
  detectedMimeType: string;
  error?: string;
  checksum: string;
  bytes: number;
}
