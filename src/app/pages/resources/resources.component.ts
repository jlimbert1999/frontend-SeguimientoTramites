import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReportService } from 'src/app/reports/services/report.service';
import { AlertService, PdfGeneratorService } from 'src/app/shared/services';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesComponent {
  constructor(
    private reporteService: ReportService,
    private alertService: AlertService,
    private pdf: PdfGeneratorService
  ) {}

  generateUnlinkSheet() {
    this.alertService.showLoadingAlert('Generando reporte', 'Espere porfavor....');
    this.reporteService.getAccountInbox().subscribe((data) => {
      this.alertService.closeLoadingAlert();
      this.pdf.GenerateUnlinkSheet(data.inbox, data.accont);
    });
  }
}
