import { FileValidationUtil, UploadedFile } from './file-validation';
import { BadRequestException } from '@nestjs/common';

describe('FileValidationUtil', () => {
  it('should accurately detect and validate PDF magic bytes (%PDF-)', () => {
    // PDF signature %PDF-
    const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);
    const file: UploadedFile = {
      originalname: 'metsihafe_qidassie.pdf',
      mimetype: 'application/pdf',
      size: pdfBuffer.length,
      buffer: pdfBuffer,
    };

    const result = FileValidationUtil.validate(file);
    expect(result.valid).toBe(true);
    expect(result.detectedMimeType).toBe('application/pdf');
    expect(result.checksum).toBeDefined();
    expect(result.bytes).toBe(pdfBuffer.length);
  });

  it('should accurately detect PNG magic bytes', () => {
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00,
    ]);
    const file: UploadedFile = {
      originalname: 'debre_libanos_icon.png',
      mimetype: 'image/png',
      size: pngBuffer.length,
      buffer: pngBuffer,
    };

    const result = FileValidationUtil.validate(file);
    expect(result.valid).toBe(true);
    expect(result.detectedMimeType).toBe('image/png');
  });

  it('should accurately detect JPEG magic bytes (FF D8 FF)', () => {
    const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const file: UploadedFile = {
      originalname: 'monastery_photo.jpg',
      mimetype: 'image/jpeg',
      size: jpegBuffer.length,
      buffer: jpegBuffer,
    };

    const result = FileValidationUtil.validate(file);
    expect(result.valid).toBe(true);
    expect(result.detectedMimeType).toBe('image/jpeg');
  });

  it('should reject disguised malicious files (e.g. exe renamed to .pdf)', () => {
    // Windows PE executable MZ header: 0x4D, 0x5A
    const fakeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]);
    const file: UploadedFile = {
      originalname: 'innocent_manuscript.pdf',
      mimetype: 'application/pdf', // Spoofed mimetype
      size: fakeBuffer.length,
      buffer: fakeBuffer,
    };

    expect(() => FileValidationUtil.validate(file)).toThrow(BadRequestException);
  });

  it('should enforce 10MB image limit', () => {
    const hugeBuffer = Buffer.alloc(11 * 1024 * 1024);
    hugeBuffer[0] = 0xff;
    hugeBuffer[1] = 0xd8;
    hugeBuffer[2] = 0xff;

    const file: UploadedFile = {
      originalname: 'huge_scan.jpg',
      mimetype: 'image/jpeg',
      size: hugeBuffer.length,
      buffer: hugeBuffer,
    };

    expect(() => FileValidationUtil.validate(file)).toThrow(BadRequestException);
  });
});
