import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateQRCodeBody, UpdateQRCodeBody } from './qrcode.types';
import { QrcodeService } from './qrcode.service';

@Controller('qrcode')
export class QrcodeController {
  constructor(private qrCodeService: QrcodeService) {}
  @Post()
  @HttpCode(201)
  createQRCode(@Body() body: CreateQRCodeBody) {
    return this.qrCodeService.create(body);
  }

  @Put(':qrId')
  @HttpCode(204)
  updateQRCode(@Param('qrId') qrId: string, @Body() body: UpdateQRCodeBody) {
    Logger.warn(body);
    return this.qrCodeService.update(qrId, body);
  }

  @Get(':qrId')
  @HttpCode(200)
  getQRCodeById(@Param('qrId') qrId: string) {
    return this.qrCodeService.getById(qrId);
  }

  @Get()
  @HttpCode(200)
  getQRCodeByUserId(@Query() query) {
    return this.qrCodeService.getByUserId(query?.userId);
  }
}
