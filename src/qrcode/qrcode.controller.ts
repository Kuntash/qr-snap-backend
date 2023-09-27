import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateQRCodeBody, UpdateQRCodeBody } from './qrcode.types';
import { QrcodeService } from './qrcode.service';

@Controller('qrcode')
export class QrcodeController {
  constructor(private qrCodeService: QrcodeService) {}
  @Post('create')
  @HttpCode(201)
  createQRCode(@Body() body: CreateQRCodeBody) {
    return this.qrCodeService.create(body);
  }

  @Put(':qrId')
  @HttpCode(204)
  updateQRCode(@Param('qrId') qrId: string, @Body() body: UpdateQRCodeBody) {
    return this.qrCodeService.update(qrId, body);
  }

  @Get(':qrId')
  @HttpCode(200)
  getQRCodeById(@Param('qrId') qrId: string) {
    return this.qrCodeService.getById(qrId);
  }
}
