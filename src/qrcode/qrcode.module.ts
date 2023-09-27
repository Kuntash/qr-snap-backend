import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QrcodeController } from './qrcode.controller';
import { QrcodeService } from './qrcode.service';
import { QRcode, QRcodeSchema } from './qrcode.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: QRcode.name, schema: QRcodeSchema }]),
  ],
  controllers: [QrcodeController],
  providers: [QrcodeService],
})
export class QRcodeModule {}
