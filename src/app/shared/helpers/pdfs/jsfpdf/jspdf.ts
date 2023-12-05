import { PDFReports } from '../pdf-reports';

export class JSPdf extends PDFReports {
  override generateReportSheet(): void {
    console.log('jspdf generate');
  }
}
