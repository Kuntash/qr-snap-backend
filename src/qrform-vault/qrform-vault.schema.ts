import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { QRcode } from 'src/qrcode/qrcode.schema';

export type QRFormVaultDocument = HydratedDocument<QRFormVault>;

@Schema({
  collection: 'QRFormVault',
})
export class QRFormVault {
  @Prop({ type: Types.ObjectId, ref: 'QRcode', required: true })
  qrId: QRcode;

  @Prop()
  rollNo: number;

  @Prop()
  name: string;

  @Prop()
  submissionDate: Date;

  @Prop({
    type: {
      lat: Number,
      lng: Number,
    },
  })
  location: {
    lat: number;
    lng: number;
  };
}

export const QRFormVaultSchema = SchemaFactory.createForClass(QRFormVault);
