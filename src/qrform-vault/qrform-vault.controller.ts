import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { QRFormVaultService } from './services/qrform-vault.service';
import { CreateQRFormVaultDocumentBody } from './qrform-vault.types';

@Controller('qrform-vault')
export class QRFormVaultController {
  constructor(private qrFormVaultService: QRFormVaultService) {}
  @Post()
  @HttpCode(201)
  createQRFormVaultDocument(@Body() body: CreateQRFormVaultDocumentBody) {
    return this.qrFormVaultService.create(body);
  }
}
