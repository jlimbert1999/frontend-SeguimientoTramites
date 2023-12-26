import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { stateProcedure } from 'src/app/procedures/interfaces';
import { MatSelectSearchData } from 'src/app/shared/interfaces';

import { ReportService } from '../../services/report.service';
import { ProcedureTableColumns, ProcedureTableData } from '../../interfaces';
import {PaginatorService} from 'src/app/shared/services';

@Component({
  selector: 'app-avanced-search',
  templateUrl: './avanced-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvancedSearchComponent implements OnInit {
  public formProcedure: FormGroup = this.fb.group({
    code: ['', Validators.minLength(4)],
    state: [''],
    reference: [''],
    type: [''],
    start: ['', Validators.required],
    end: [new Date(), Validators.required],
    group: [''],
  });
  public datasource = signal<ProcedureTableData[]>([]);
  public displaycolums: ProcedureTableColumns[] = [
    { columnDef: 'code', header: 'Alterno' },
    { columnDef: 'reference', header: 'Referencia' },
    { columnDef: 'state', header: 'Estado' },
    { columnDef: 'date', header: 'Fecha' },
  ];
  public types = signal<MatSelectSearchData<string>[]>([]);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reportService: ReportService,
    private paginatorService:PaginatorService
  ) {}

  ngOnInit(): void {
    this.loadSearchParams();
  }
  searchTypesProcedures(text: string) {
    this.reportService.getProceduresByText(text).subscribe((types) => {
      this.types.set(types.map((el) => ({ value: el._id, text: el.nombre })));
    });
  }

  selectTypeProcedure(id_type: string) {
    this.formProcedure.get('type')?.setValue(id_type);
  }

  search() {
    if (this.formProcedure.invalid) return;
    this.reportService
      .searchProcedureByProperties(this.paginatorService.PaginationParams, this.formProcedure.value)
      .subscribe((resp) => {
        this.paginatorService.length = resp.length;
        this.datasource.set(resp.procedures);
      });
  }

  showDetails(procedure: ProcedureTableData) {
    const params = { limit: this.paginatorService.limit, offset: this.paginatorService.index, search: true };
    this.router.navigate(['reportes/busqueda-avanzada', procedure.group, procedure.id_procedure], {
      queryParams: params,
    });
  }

  generateReport() {
    this.paginatorService.offset = 0;
    this.saveSearchParams();
    this.search();
  }

  saveSearchParams() {
    this.paginatorService.cache['form'] = this.formProcedure.value;
    this.paginatorService.cache['types'] = this.types();
  }

  loadSearchParams() {
    if (!this.paginatorService.searchMode) return;
    this.formProcedure.patchValue(this.paginatorService.cache['form'] ?? {});
    this.types.set(this.paginatorService.cache['types'] ?? []);
    this.search();
  }

  get statesProcedure() {
    return Object.values(stateProcedure);
  }

  get currentMatSelectOption() {
    return this.formProcedure.get('type')?.value;
  }
}
