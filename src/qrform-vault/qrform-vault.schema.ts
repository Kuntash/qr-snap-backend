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
  rollNo: string;

  @Prop()
  name: string;
}

export const QRFormVaultSchema = SchemaFactory.createForClass(QRFormVault);
