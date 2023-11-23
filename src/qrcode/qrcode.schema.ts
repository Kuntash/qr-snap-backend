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

  @Prop()
  googleSheetURL: string;

  // last sheet url that has been set, if this is same as the current sheet trigger initiliase header func, otherwise don't
  @Prop()
  lastSheetURL: string;

  @Prop({
    type: {
      north: Number,
      south: Number,
      east: Number,
      west: Number,
    },
  })
  geofence?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export const QRcodeSchema = SchemaFactory.createForClass(QRcode);
