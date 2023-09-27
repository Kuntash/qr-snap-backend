import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateQRCodeBody, UpdateQRCodeBody } from './qrcode.types';
import { InjectModel } from '@nestjs/mongoose';
import { QRcode } from './qrcode.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class QrcodeService {
  constructor(@InjectModel(QRcode.name) private qrCodeModel: Model<QRcode>) {}
  async create(qrcode: CreateQRCodeBody) {
    const createdQRcode = new this.qrCodeModel(qrcode);

    try {
      const createQRcodeDocument = await createdQRcode.save();
      return createQRcodeDocument;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async update(qrId: string, qrUpdateObject: UpdateQRCodeBody) {
    try {
      const filter = {
        _id: new Types.ObjectId(qrId),
      };

      const updatedQRcodeDocument = await this.qrCodeModel.findOneAndUpdate(
        filter,
        qrUpdateObject,
      );
      Logger.log(updatedQRcodeDocument);
      return updatedQRcodeDocument;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getById(qrId: string) {
    try {
      const filter = {
        _id: new Types.ObjectId(qrId),
      };
      const QRcodeDocument = await this.qrCodeModel.findOne(filter);
      return QRcodeDocument;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
