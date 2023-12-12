import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ChartLineData } from '../../interfaces/chart-line.data.interface';
import { ReportService } from '../../services/report.service';
import { institution } from 'src/app/administration/interfaces';
import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { FormControl } from '@angular/forms';
import { GlobalReport } from '../../interfaces/global-report.interface';
import { statusMail } from 'src/app/communication/interfaces';
import { stateProcedure } from 'src/app/procedures/interfaces';

type reportType = 'records' | 'incoming' | 'outgoing' | null;
@Component({
  selector: 'app-dashboard-total-communications',
  templateUrl: `./dashboard-total-communications.component.html`,
  styleUrl: './dashboard-total-communications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTotalCommunicationsComponent {
  reportType = signal<reportType>(null);
  columns = computed<{ columnDef: string; header: string }[]>(() => {
    if (!this.reportType()) return [];
    let colums:{ columnDef: string; header: string }[] = [];
    // if (this.reportType() === 'incoming' || this.reportType() === 'outgoing') {
    //   colums = [
    //     { columnDef: 'dependency', header: 'Unidad' },
    //     { columnDef: statusMail.Received, header: 'Recibidos' },
    //     { columnDef: statusMail.Archived, header: 'Archivados' },
    //     { columnDef: statusMail.Pending, header: 'Pendientes' },
    //     { columnDef: statusMail.Completed, header: 'Completados' },
    //     { columnDef: statusMail.Rejected, header: 'Rechazados' },
    //   ];
    // }
    // return colums
    return [
      { columnDef: 'dependency', header: 'Unidad' },
      { columnDef: stateProcedure.ANULADO, header: 'Anulados' },
      { columnDef: stateProcedure.CONCLUIDO, header: 'Concluidos' },
      { columnDef: stateProcedure.INSCRITO, header: 'Inscritos' },
      { columnDef: stateProcedure.OBSERVADO, header: 'Observados' },
      { columnDef: stateProcedure.REVISION, header: 'En revision' },
      { columnDef: stateProcedure.SUSPENDIDO, header: 'Suspendidos' },
    ];
  });
  displayedColumns = this.columns().map((c) => c.columnDef);

  institutions = signal<MatSelectSearchData<string>[]>([]);
  institution: string = '';

  fontStyleControl = new FormControl('');
  fontStyle?: string;
  data = signal<GlobalReport[]>([]);

  constructor(private reportService: ReportService) {
    this.getInstitutions();
  }
  getInstitutions() {
    this.reportService.getInstitutions().subscribe((resp) => {
      this.institutions.set(resp.map((inst) => ({ text: inst.nombre, value: inst._id })));
    });
  }
  selectInstitution(id_institution: string) {
    this.institution = id_institution;
  }

  generate() {
    this.reportService.getTotalIncomingMailsByInstitution(this.institution).subscribe((data) => {
      this.data.set(data);
    });
  }
}
