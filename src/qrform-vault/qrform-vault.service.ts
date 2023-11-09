import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateQRFormVaultDocumentBody } from './qrform-vault.types';
import { InjectModel } from '@nestjs/mongoose';
import { QRFormVault } from './qrform-vault.schema';
import { Model } from 'mongoose';
import { QRcode } from 'src/qrcode/qrcode.schema';
import { isPointInsideRectangle } from 'src/utils/utils.qrform-vault';

@Injectable()
export class QRFormVaultService {
  constructor(
    @InjectModel(QRFormVault.name) private qrFormVaultModel: Model<QRFormVault>,
    @InjectModel(QRcode.name) private qrCodeModel: Model<QRcode>,
  ) {}
  async create(formSubmission: CreateQRFormVaultDocumentBody) {
    if (formSubmission?.template === 'attendance') {
      if (
        !formSubmission.name ||
        !formSubmission.qrId ||
        !formSubmission.rollNo ||
        !formSubmission.location
      ) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      /* Logic for form submission */
      /* 
        1. Check if the qr code exists and isActive.
        2. Check if a form submission to this qr code has already been made by this roll no for today's class.
      */

      const qrCode = await this.qrCodeModel.findById(formSubmission.qrId);
      if (!qrCode) {
        throw new HttpException(
          'QR Code does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!qrCode?.isActive) {
        throw new HttpException(
          'QR Code is not active',
          HttpStatus.BAD_REQUEST,
        );
      }

      const formattedTodayDate = new Date().toISOString().split('T')[0];
      const hasAlreadySubmittedTodayAggregation = [
        {
          '$match': {
            'qrId': formSubmission?.qrId,
            'rollNo': formSubmission?.rollNo,
            '$expr': {
              '$eq': [
                {
                  '$dateToString': {
                    'format': '%Y-%m-%d',
                    'date': '$submissionDate',
                  },
                },
                formattedTodayDate,
              ],
            },
          },
        },
      ];
      const existingSubmission = await this.qrFormVaultModel.aggregate(
        hasAlreadySubmittedTodayAggregation,
      );
      if (existingSubmission?.length) {
        throw new HttpException(
          'You have already submitted your attendance for today.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (qrCode?.geofence) {
        const { north, south, east, west } = qrCode?.geofence;
        const { location } = formSubmission;
        if (
          !isPointInsideRectangle({
            north,
            south,
            east,
            west,
            lat: location?.lat,
            lng: location?.lng,
          })
        ) {
          throw new HttpException(
            'Please submit your attendance from inside the class',
            HttpStatus.FORBIDDEN,
          );
        }
      }
      const createdQRFormVaultDocument = new this.qrFormVaultModel({
        ...formSubmission,
        submissionDate: new Date(),
      });

      try {
        return await createdQRFormVaultDocument.save();
      } catch (error) {
        Logger.log(error);
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }
}
