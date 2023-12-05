import { procedure } from 'src/app/procedures/interfaces';

export abstract class PDFReports {
  abstract generateReportSheet(procedures: procedure[]): Promise<void>;
}
