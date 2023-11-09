export type CreateQRCodeBody = AttendanceQRBody;
export type UpdateQRCodeBody = Partial<CreateQRCodeBody>;
export type AttendanceQRBody = {
  isActive?: boolean;
  createdBy: string;
  template: 'attendance';
  title: string;
  activationDays: number[];
  activationTimes?: {
    fromTime: string;
    toTime: string;

    // TODO: time offset for timezones
  };

  deactivationDate: Date;
  geofence?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
};
