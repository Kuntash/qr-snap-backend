export type CreateQRFormVaultDocumentBody = AttendanceFormVaultDocumentBody;

type AttendanceFormVaultDocumentBody = {
  qrId: string;
  rollNo: string;
  name: number;
  location: {
    lat: number;
    lng: number;
  };
  template: 'attendance';
};
