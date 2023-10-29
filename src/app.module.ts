import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { QRcodeModule } from './qrcode/qrcode.module';
import { QRFormVaultModule } from './qrform-vault/qrform-vault.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    QRcodeModule,
    QRFormVaultModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
