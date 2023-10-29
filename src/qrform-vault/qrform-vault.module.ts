import { Module } from '@nestjs/common';
import { QRFormVaultService } from './qrform-vault.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QRFormVault, QRFormVaultSchema } from './qrform-vault.schema';
import { QRFormVaultController } from './qrform-vault.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QRFormVault.name, schema: QRFormVaultSchema },
    ]),
  ],
  controllers: [QRFormVaultController],
  providers: [QRFormVaultService],
})
export class QRFormVaultModule {}
