import { ChangeDetectionStrategy, Component, signal, type OnInit, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { account } from 'src/app/administration/interfaces';
import { statusMail } from 'src/app/communication/interfaces';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { MatSelectSearchData } from 'src/app/shared/interfaces';

import { ReportService } from '../../services/report.service';
import { ProcedureTableColumns, ProcedureTableData } from '../../interfaces';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrl: './unit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitComponent implements OnInit {
  formSearch: FormGroup = this.fb.group({
    status: [''],
    account: [''],
    start: [null, Validators.required],
    end: [new Date(), Validators.required],
  });
  accounts = signal<account[]>([]);
  public matSelectOptions = computed<MatSelectSearchData<string>[]>(() => {
    return this.accounts().map((account) => {
      const { funcionario } = account;
      const text = funcionario
        ? [funcionario.nombre, funcionario.paterno, funcionario.materno].filter((it) => !!it).join(' ')
        : 'POR DESIGNAR';
      return { value: account._id, text };
    });
  });
  public datasource = signal<ProcedureTableData[]>([]);
  public displaycolums: ProcedureTableColumns[] = [
    { columnDef: 'code', header: 'Alterno' },
    { columnDef: 'reference', header: 'Referencia' },
    { columnDef: 'state', header: 'Estado' },
    { columnDef: 'manager', header: 'Enviado a' },
    { columnDef: 'date', header: 'Ingreso' },
  ];

  public validStatus = [
    { value: statusMail.Pending, text: 'PENDIENTES' },
    { value: statusMail.Received, text: 'RECIBIDOS' },
    { value: statusMail.Rejected, text: 'RECHAZADOS' },
    { value: statusMail.Archived, text: 'ARCHIVADOS' },
    { value: statusMail.Completed, text: 'ENVIADOS' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reportService: ReportService,
    private paginatorService: PaginatorService
  ) {}

  ngOnInit(): void {
    this.loadSearchData();
  }

  search() {
    if (this.formSearch.invalid) return;
    this.reportService
      .searchProcedureByUnit(
        { limit: this.paginatorService.limit, offset: this.paginatorService.offset },
        this.formSearch.value
      )
      .subscribe((resp) => {
        this.datasource.set(resp.data);
        this.paginatorService.length = resp.length;
      });
  }

  generateReport() {
    this.paginatorService.offset = 0;
    this.saveSearchParams();
    this.search();
  }

  getOfficersInMyDependency() {
    this.reportService.getOfficersInMyDependency().subscribe((resp) => {
      this.accounts.set(resp);
    });
  }
  selectMatSearchOption(id_account: string) {
    this.formSearch.get('account')?.setValue(id_account);
  }

  showDetails(element: ProcedureTableData) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.index,
      search: true,
    };
    this.router.navigate(['reportes/unidad', element.group, element.id_procedure], {
      queryParams: params,
    });
  }

  get currentSelectedOption() {
    return this.formSearch.get('account')?.value;
  }

  saveSearchParams() {
    this.paginatorService.cache['accounts'] = this.accounts();
    this.paginatorService.cache['form'] = this.formSearch.value;
  }

  loadSearchData() {
    this.accounts.set(this.paginatorService.cache['accounts'] ?? []);
    if (this.accounts().length === 0) this.getOfficersInMyDependency();
    if (!this.paginatorService.searchMode) return;
    this.formSearch.patchValue(this.paginatorService.cache['form'] ?? {});
    this.search();
  }
}
