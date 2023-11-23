import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateQRCodeBody, UpdateQRCodeBody } from './qrcode.types';
import { InjectModel } from '@nestjs/mongoose';
import { QRcode } from './qrcode.schema';
import { Model, Types } from 'mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { isTimeBetween } from 'src/utils/utils.qrcode';
import { GoogleSheetsService } from 'src/qrform-vault/services/google-sheets.service';
@Injectable()
export class QrcodeService {
  constructor(
    @InjectModel(QRcode.name) private qrCodeModel: Model<QRcode>,
    private schedulerRegistry: SchedulerRegistry,
    private googleSheetService: GoogleSheetsService,
  ) {}
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
    const tempQRUpdateObject = { ...qrUpdateObject };
    const filter = {
      _id: new Types.ObjectId(qrId),
    };

    const oldQRcodeDocument = await this.qrCodeModel.findOne(filter);
    const updatedQRcodeDocument = await this.qrCodeModel.findOneAndUpdate(
      filter,
      tempQRUpdateObject,
      {
        new: true,
      },
    );
    try {
      if (qrUpdateObject?.template === 'attendance') {
        /* google sheet stuff */

        if (!!qrUpdateObject?.googleSheetURL) {
          /* initialise sheet headers if its a new google sheet url or its the first one */
          if (
            !oldQRcodeDocument?.lastSheetURL ||
            oldQRcodeDocument?.lastSheetURL === qrUpdateObject?.googleSheetURL
          ) {
            await this.googleSheetService.writeCellValue({
              range: 'A1:C1',
              spreadSheetId: qrUpdateObject?.googleSheetURL,
              values: [['Roll No.', 'Name']],
            });

            updatedQRcodeDocument.lastSheetURL = qrUpdateObject?.googleSheetURL;
          }
        }

        const currentTime = new Date();

        // Extract the hours and minutes from the Date object
        const currentHours = `${currentTime.getHours()}`.padStart(2, '0');
        const currentMinutes = `${currentTime.getMinutes()}`.padStart(2, '0');
        if (
          isTimeBetween({
            startTime: tempQRUpdateObject.activationTimes.fromTime,
            endTime: tempQRUpdateObject.activationTimes.toTime,
            checkTime: `${currentHours}:${currentMinutes}`,
          })
        ) {
          updatedQRcodeDocument.isActive = true;
        }
        /* Logic to activate the QR code */
        /*
           1. create a cron job that activates the qr code at the start time and deactivates the qr code at the end time.
        */

        /* qr code activation end date */
        const endDate = new Date(qrUpdateObject?.deactivationDate);

        /* qr code activation start minute */
        const startMinute = Number(
          qrUpdateObject?.activationTimes?.fromTime.split(':')?.[1],
        );

        /* qr code activation start hour */
        const startHour = Number(
          qrUpdateObject?.activationTimes?.fromTime.split(':')?.[0],
        );

        /* qr code activation end minute */
        const endMinute = Number(
          qrUpdateObject?.activationTimes?.toTime.split(':')?.[1],
        );

        /* qr code activation end hour */
        const endHour = Number(
          qrUpdateObject?.activationTimes?.toTime.split(':')?.[0],
        );

        /* qr code activation days */
        const days = qrUpdateObject?.activationDays?.join(',');
        /* cron expression to activate qr code */
        const startActivationCronExpression = `0 ${startMinute} ${startHour} * * ${days}`;
        const startActivationCronName = `startActivationCronJob-${qrId}`;
        this.updateQRCodeActivationStatusCronJob({
          qrId,
          cronExpression: startActivationCronExpression,
          cronName: startActivationCronName,
          status: true,
        });

        /* cron expression to deactivate qr code */
        const startDeactivationCronExpression = `0 ${endMinute} ${endHour} * * ${days}`;
        const startDeactivationCronName = `startDeactivationCronJob-${qrId}`;

        this.updateQRCodeActivationStatusCronJob({
          qrId,
          cronExpression: startDeactivationCronExpression,
          cronName: startDeactivationCronName,
          status: false,
        });

        /* Logic to delete qr activation / deactivation cron */
        this.deleteQRCodeCronJobsCron({
          cronDate: endDate,
          cronNames: [startActivationCronName, startDeactivationCronName],
          qrId,
        });
      }
      return updatedQRcodeDocument.save();
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

  async getByUserId(userId: string) {
    try {
      const filter = {
        createdBy: userId,
      };
      const QRcodeDocuments = await this.qrCodeModel.find(filter);
      return QRcodeDocuments;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  /* update qr code activation status cron job */
  updateQRCodeActivationStatusCronJob(args: {
    qrId: string;
    status: boolean;
    cronExpression: string;
    cronName: string;
  }) {
    const { cronExpression, cronName, ...rest } = args;

    if (this.schedulerRegistry.doesExist('cron', cronName)) {
      this.schedulerRegistry.deleteCronJob(cronName);
      Logger.log(`Cron job ${cronName} is deleted`);
    }
    const job = new CronJob(cronExpression, () => {
      Logger.log(`Cron job ${cronName} is running`);
      this.updateQRActivationStatus(rest);
    });

    this.schedulerRegistry.addCronJob(cronName, job);
    job.start();
    Logger.log(`Cron: ${cronName} initialized`);
  }

  deleteQRCodeCronJobsCron(args: {
    cronNames: string[];
    cronDate: Date;
    qrId: string;
  }) {
    const { cronDate, cronNames, qrId } = args;
    const job = new CronJob(cronDate, () => {
      for (const cronName of cronNames) {
        this.schedulerRegistry.deleteCronJob(cronName);
        Logger.log(`Cron job ${cronName} is deleted`);
      }

      const filter = {
        _id: new Types.ObjectId(qrId),
      };

      this.qrCodeModel.findOneAndUpdate(
        filter,
        {
          isActive: false,
        },
        {
          new: true,
        },
      );
    });
    job.start();
  }

  /* service to activate qr code */
  async updateQRActivationStatus(args: { qrId: string; status: boolean }) {
    const { qrId, status } = args;
    const filter = {
      _id: new Types.ObjectId(qrId),
    };

    const updatedQRcodeDocument = await this.qrCodeModel.findOneAndUpdate(
      filter,
      {
        isActive: status,
      },
      {
        new: true,
      },
    );

    return updatedQRcodeDocument;
  }
}
