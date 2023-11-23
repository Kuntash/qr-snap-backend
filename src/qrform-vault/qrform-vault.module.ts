import { Module } from '@nestjs/common';
import { QRFormVaultService } from './services/qrform-vault.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QRFormVault, QRFormVaultSchema } from './qrform-vault.schema';
import { QRFormVaultController } from './qrform-vault.controller';
import { QRcode, QRcodeSchema } from 'src/qrcode/qrcode.schema';
import { GoogleSheetsService } from './services/google-sheets.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QRFormVault.name, schema: QRFormVaultSchema },
      { name: QRcode.name, schema: QRcodeSchema },
    ]),
  ],
  controllers: [QRFormVaultController],
  providers: [QRFormVaultService, GoogleSheetsService],
})
export class QRFormVaultModule {}
