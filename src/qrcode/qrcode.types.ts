export type CreateQRCodeBody = AttendanceQRBody;
export type UpdateQRCodeBody = Partial<CreateQRCodeBody>;
export type AttendanceQRBody = {
  template: 'attendance';
  title: string;
  activationDays: number[];
  activationTimes?: {
    fromTime: string;
    toTime: string;

    // TODO: time offset for timezones
  };
  geofence?: { lat: number; lng: number }[];
};
