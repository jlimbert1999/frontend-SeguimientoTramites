import { ChangeDetectionStrategy, Component, signal, type OnInit, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { statusMail } from 'src/app/communication/interfaces';
import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { account } from 'src/app/administration/interfaces';

import { ReportService } from '../../services/report.service';
import { ProcedureTableColumns, ProcedureTableData } from '../../interfaces';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrl: './unit.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitComponent implements OnInit {
  formSearch: FormGroup = this.fb.group({
    status: [''],
    account: [''],
    start: [, Validators.required],
    end: [new Date(), Validators.required],
  });
  accounts = signal<account[]>([]);
  public matSelectOptions = computed<MatSelectSearchData<account>[]>(() => {
    return this.accounts().map((account) => {
      const { funcionario } = account;
      const text = funcionario
        ? [funcionario.nombre, funcionario.paterno, funcionario.materno].filter((it) => !!it).join(' ')
        : 'POR DESIGNAR';
      return { value: account, text };
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
    { value: statusMail.Received, text: 'RECIBIDOS' },
    { value: statusMail.Pending, text: 'PENDIENTES' },
    { value: statusMail.Rejected, text: 'RECHAZADOS' },
    { value: statusMail.Completed, text: 'ENVIADOS' },
    { value: statusMail.Completed, text: 'ARCHIVADOS' },
  ];
  searchParams = signal<Object>({});

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reportService: ReportService,
    private paginatorService: PaginatorService
  ) {}

  ngOnInit(): void {
    this.loadSearchParas();
    this.getOfficersInMyDependency();
  }

  search() {
    this.searchParams.set(this.reportService.getValidParamsForm(this.formSearch.value));
    this.reportService
      .searchProcedureByUnit(
        {
          limit: this.paginatorService.limit,
          offset: this.paginatorService.offset,
        },
        this.searchParams()
      )
      .subscribe((resp) => {
        this.datasource.set(resp.data);
        this.paginatorService.length = resp.length;
      });
  }
  generateReport() {
    this.paginatorService.offset = 0;
    this.search();
  }

  getOfficersInMyDependency() {
    this.reportService.getOfficersInMyDependency().subscribe((resp) => {
      this.accounts.set(resp);
    });
  }
  selectMatSearchOption(account: account) {
    this.formSearch.get('account')?.setValue(account._id);
  }

  showDetails(element: ProcedureTableData) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
      search: true,
    };
    this.saveSearchParams();
    this.router.navigate(['reportes/unidad', element.group, element.id_procedure], {
      queryParams: params,
    });
  }
  saveSearchParams() {
    this.paginatorService.searchParams = new Map(Object.entries(this.searchParams()));
    this.paginatorService.cacheStore['account'] = this.accounts();
  }

  loadSearchParas() {
    this.formSearch.patchValue(Object.fromEntries(this.paginatorService.searchParams));
  }
}
