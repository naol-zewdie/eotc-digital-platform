import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { FileValidationResult, StandardErrorCode } from '@eotc/contracts';

export interface UploadedFile {
  fieldname?: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export class FileValidationUtil {
  // Maximum size limits in bytes (Section 15)
  static readonly LIMITS = {
    PDF: 52428800, // 50 MB
    IMAGE: 10485760, // 10 MB
    AUDIO: 26214400, // 25 MB
  };

  /**
   * Inspects magic bytes / file signature to verify true MIME type
   */
  static detectMimeType(buffer: Buffer): string | null {
    if (!buffer || buffer.length < 4) {
      return null;
    }

    // PDF signature: %PDF- (0x25, 0x50, 0x44, 0x46)
    if (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46
    ) {
      return 'application/pdf';
    }

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    ) {
      return 'image/png';
    }

    // JPEG signature: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'image/jpeg';
    }

    // WebP signature: RIFF....WEBP
    if (
      buffer.length >= 12 &&
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      return 'image/webp';
    }

    // MP3 ID3 header: 49 44 33
    if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
      return 'audio/mpeg';
    }

    // MP3 raw frame sync: FF FB or FF F3
    if (buffer[0] === 0xff && (buffer[1] === 0xfb || buffer[1] === 0xf3)) {
      return 'audio/mpeg';
    }

    // MP4 / M4A: ftyp signature at offset 4
    if (
      buffer.length >= 8 &&
      buffer[4] === 0x66 &&
      buffer[5] === 0x74 &&
      buffer[6] === 0x79 &&
      buffer[7] === 0x70
    ) {
      return 'audio/mp4';
    }

    return null;
  }

  /**
   * Computes SHA-256 hex checksum
   */
  static calculateChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Strict verification pipeline (Section 15)
   */
  static validate(file: UploadedFile): FileValidationResult {
    const detected = this.detectMimeType(file.buffer);
    const checksum = this.calculateChecksum(file.buffer);
    const bytes = file.buffer.length;

    if (!detected) {
      throw new BadRequestException({
        code: StandardErrorCode.VALIDATION_ERROR,
        message: 'File signature verification failed: unrecognized or unsupported format.',
        details: [
          {
            field: 'file',
            reason: `Declared mimetype '${file.mimetype}' does not match any allowed file signatures (PDF, PNG, JPEG, WebP, MP3, M4A).`,
          },
        ],
      });
    }

    // Check size limit by detected media type
    if (detected === 'application/pdf' && bytes > this.LIMITS.PDF) {
      throw new BadRequestException({
        code: StandardErrorCode.VALIDATION_ERROR,
        message: `PDF size exceeds 50MB limit (${Math.round(bytes / (1024 * 1024))}MB uploaded).`,
      });
    }

    if (detected.startsWith('image/') && bytes > this.LIMITS.IMAGE) {
      throw new BadRequestException({
        code: StandardErrorCode.VALIDATION_ERROR,
        message: `Image size exceeds 10MB limit (${Math.round(bytes / (1024 * 1024))}MB uploaded).`,
      });
    }

    if (detected.startsWith('audio/') && bytes > this.LIMITS.AUDIO) {
      throw new BadRequestException({
        code: StandardErrorCode.VALIDATION_ERROR,
        message: `Audio size exceeds 25MB limit (${Math.round(bytes / (1024 * 1024))}MB uploaded).`,
      });
    }

    return {
      valid: true,
      detectedMimeType: detected,
      checksum,
      bytes,
    };
  }
}
