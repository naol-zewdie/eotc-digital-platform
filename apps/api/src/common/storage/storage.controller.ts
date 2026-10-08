import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('file/:objectKey(*)')
  streamFile(@Param('objectKey') objectKey: string, @Res() res: Response) {
    const file = this.storageService.getFileStream(objectKey);
    if (!file) {
      throw new NotFoundException(`Requested storage binary '${objectKey}' not found.`);
    }

    // Determine basic content type
    let contentType = 'application/octet-stream';
    if (objectKey.endsWith('.pdf')) contentType = 'application/pdf';
    else if (objectKey.endsWith('.jpg') || objectKey.endsWith('.jpeg')) contentType = 'image/jpeg';
    else if (objectKey.endsWith('.png')) contentType = 'image/png';
    else if (objectKey.endsWith('.webp')) contentType = 'image/webp';
    else if (objectKey.endsWith('.mp3')) contentType = 'audio/mpeg';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', file.size);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');

    file.stream.pipe(res);
  }
}
