import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { google, sheets_v4 } from 'googleapis';

@Injectable()
export class GoogleSheetsService {
  private auth: any;
  private sheets: sheets_v4.Sheets;

  constructor() {
    const credentials = JSON.parse(
      readFileSync(process.env.GOOGLE_CREDENTIALS_PATH).toString(),
    );
    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });

    this.readSheetValues({
      spreadSheetId: '1VfSEwGxhYxzUL3ApcCSqiNZL2vtZAK4wnL7Q80UfxwE',
      range: 'A1:A200',
    });
  }

  async updateCellValues(args: {
    values: any[][];
    spreadSheetId: string;
    range?: string;
  }) {
    const { values, spreadSheetId, range } = args;

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: spreadSheetId,
      valueInputOption: 'USER_ENTERED',
      ...(range && { range }),
      requestBody: {
        values,
      },
    });
  }
  async writeCellValue(args: {
    values: any[][];
    spreadSheetId: string;
    range?: string;
  }) {
    const { values, spreadSheetId, range } = args;

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: spreadSheetId,
      valueInputOption: 'USER_ENTERED',
      ...(range && { range }),
      requestBody: {
        values,
      },
    });
  }
  async readSheetValues(args: { spreadSheetId: string; range: string }) {
    const { spreadSheetId, range } = args;
    const response = await this.sheets.spreadsheets.values?.get({
      spreadsheetId: spreadSheetId,
      range,
    });
    if (response?.data?.values) {
      console.log(
        '🚀 ~ file: google-sheets.service.ts:50 ~ GoogleSheetsService ~ readSheetValues ~ response?.data?.values:',
        response?.data?.values.flat(),
      );

      return response?.data?.values;
    }

    return [];
  }
}
