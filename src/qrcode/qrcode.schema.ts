import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QRcodeDocument = HydratedDocument<QRcode>;

@Schema({
  collection: 'QRCodes',
})
export class QRcode {
  @Prop()
  isActive: boolean;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  title: string;

  @Prop({ required: true })
  template: string;

  @Prop([Number])
  activationDays: number[];

  @Prop(
    raw({
      fromTime: { type: String },
      toTime: { type: String },
    }),
  )
  activationTimes?: {
    fromTime: string;
    toTime: string;

    // TODO: time offset for timezones
  };

  @Prop()
  deactivationDate: Date;

  @Prop(
    raw([
      {
        lat: { type: Number },
        lng: { type: Number },
      },
    ]),
  )
  geofence?: { lat: number; lng: number }[];
}

export const QRcodeSchema = SchemaFactory.createForClass(QRcode);
