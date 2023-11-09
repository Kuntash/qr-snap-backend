import { Module } from '@nestjs/common';
import { QRFormVaultService } from './qrform-vault.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QRFormVault, QRFormVaultSchema } from './qrform-vault.schema';
import { QRFormVaultController } from './qrform-vault.controller';
import { QRcode, QRcodeSchema } from 'src/qrcode/qrcode.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QRFormVault.name, schema: QRFormVaultSchema },
      { name: QRcode.name, schema: QRcodeSchema },
    ]),
  ],
  controllers: [QRFormVaultController],
  providers: [QRFormVaultService],
})
export class QRFormVaultModule {}
