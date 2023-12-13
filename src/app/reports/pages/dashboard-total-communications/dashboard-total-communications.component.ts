import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { statusMail } from 'src/app/communication/interfaces';
import { groupProcedure, stateProcedure } from 'src/app/procedures/interfaces';

@Component({
  selector: 'app-dashboard-total-communications',
  templateUrl: `./dashboard-total-communications.component.html`,
  styleUrl: './dashboard-total-communications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTotalCommunicationsComponent {
  formSearch: FormGroup = this.fb.group({
    id_institution: ['', Validators.required],
    group: ['', Validators.required],
    participant: ['', Validators.required],
  });
  public collection = signal<'communications' | 'procedures' | null>(null);
  public displayedColumns = computed<{ columnDef: string; header: string }[]>(() => {
    if (!this.collection()) return [];
    if (this.collection() === 'communications')
      return [
        { columnDef: 'dependency', header: 'Unidad' },
        { columnDef: statusMail.Archived, header: 'Archivados' },
        { columnDef: statusMail.Completed, header: 'Despachados' },
        { columnDef: statusMail.Pending, header: 'Pendientes' },
        { columnDef: statusMail.Received, header: 'Recibidos' },
        { columnDef: statusMail.Rejected, header: 'Rechazados' },
      ];
    return [
      { columnDef: 'dependency', header: 'Unidad' },
      { columnDef: stateProcedure.INSCRITO, header: 'Inscrito' },
      { columnDef: stateProcedure.REVISION, header: 'En revision' },
      { columnDef: stateProcedure.OBSERVADO, header: 'Observador' },
      { columnDef: stateProcedure.CONCLUIDO, header: 'Concluidos' },
      { columnDef: stateProcedure.SUSPENDIDO, header: 'Suspendidos' },
      { columnDef: stateProcedure.ANULADO, header: 'Anulados' },
    ];
  });
  institution: string = '';
  institutions = signal<MatSelectSearchData<string>[]>([]);
  dataSource = signal<{ [key: string]: number | string }[]>([]);

  constructor(private reportService: ReportService, private fb: FormBuilder) {
    this.getInstitutions();
    effect(() => {});
  }
  getInstitutions() {
    this.reportService.getInstitutions().subscribe((resp) => {
      this.institutions.set(resp.map((inst) => ({ text: inst.nombre, value: inst._id })));
    });
  }
  selectInstitution(id_institution: string) {
    this.formSearch.get('id_institution')?.setValue(id_institution);
  }
  // selectTypeSearch(participant: fromData) {
  //   if (participant==='incoming') this.formSearch.get('participant')?.setValue('emitter');
  // }

  generate() {
    // this.reportService
    //   .getTotalProceduresByInstitution()
    //   .subscribe((resp) => {
    //     this.dataSource.set(resp);
    //   });
  }

  get groupProcedure() {
    return groupProcedure;
  }
}
