import { statusMail } from 'src/app/communication/interfaces';

export interface ReportTotalIncomingMails {
  _id: string;
  details: Detail[];
  total: number;
  name: string;
}

export interface Detail {
  status: statusMail;
  count: number;
}
