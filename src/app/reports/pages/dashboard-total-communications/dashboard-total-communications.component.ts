import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartLineData } from '../../interfaces/chart-line.data.interface';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-dashboard-total-communications',
  templateUrl: `./dashboard-total-communications.component.html`,
  styleUrl: './dashboard-total-communications.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTotalCommunicationsComponent {
  data: ChartLineData[] = [{dependencia:'nombre', received:2, rejected:1, pending:1}];
  constructor(private reportService: ReportService) {
    this.reportService.getTotalIncomingMailsByInstitution('63af377f1b1e2505e47e77c5').subscribe((data) => {
      this.data = data.map((el) => {
        const chartData = {
          dependencia: el.name,
        
        };
        return chartData;
      });
      console.log(this.data);
      this.data = [...this.data];
    });
  }
}
