import { PDFReports } from './pdf-reports';

export class PDFAdapter {
  constructor(private readonly pdf: PDFReports) {}

  createRouteMap() {
    this.pdf.generateReportSheet();
  }
}
