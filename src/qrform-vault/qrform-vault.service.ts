import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateQRFormVaultDocumentBody } from './qrform-vault.types';
import { InjectModel } from '@nestjs/mongoose';
import { QRFormVault } from './qrform-vault.schema';
import { Model } from 'mongoose';

@Injectable()
export class QRFormVaultService {
  constructor(
    @InjectModel(QRFormVault.name) private qrFormVaultModel: Model<QRFormVault>,
  ) {}
  async create(formSubmission: CreateQRFormVaultDocumentBody) {
    if (
      !formSubmission.name ||
      !formSubmission.qrId ||
      !formSubmission.rollNo
    ) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const createdQRFormVaultDocument = new this.qrFormVaultModel(
      formSubmission,
    );

    try {
      return await createdQRFormVaultDocument.save();
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
