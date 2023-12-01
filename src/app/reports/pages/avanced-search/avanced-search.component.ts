import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';

import { procedure, stateProcedure } from 'src/app/procedures/interfaces';
import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { PaginatorService } from 'src/app/shared/services/paginator.service';

import { ReportService } from '../../services/report.service';
import { ProcedureTableColumns, ProcedureTableData } from '../../interfaces';

@Component({
  selector: 'app-avanced-search',
  templateUrl: './avanced-search.component.html',
  styleUrl: './avanced-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvancedSearchComponent implements OnInit {
  public formProcedure: FormGroup = this.fb.group({
    code: ['', [Validators.minLength(4)]],
    state: [''],
    reference: ['', [Validators.minLength(4)]],
    type: [''],
    start: [''],
    end: [new Date()],
    group: [''],
  });
  public datasource: ProcedureTableData[] = [];
  public displaycolums: ProcedureTableColumns[] = [
    { columnDef: 'code', header: 'Alterno' },
    { columnDef: 'reference', header: 'Referencia' },
    { columnDef: 'state', header: 'Estado' },
    { columnDef: 'date', header: 'Fecha' },
  ];
  types: MatSelectSearchData<string>[] = [];
  initialMatSelectValue: string | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reportService: ReportService,
    private paginatorService: PaginatorService
  ) {}

  ngOnInit(): void {
    this.loadSearchParams();
  }
  searchTypesProcedures(text: string) {
    this.reportService.getProceduresByText(text).subscribe((types) => {
      this.types = types.map((el) => ({ value: el._id, text: el.nombre }));
    });
  }

  selectTypeProcedure(id: string = '') {
    this.formProcedure.get('type')?.setValue(id);
  }

  search() {
    if (this.formProcedure.invalid) return;
    this.reportService
      .searchProcedureByProperties(this.paginatorService, this.formProcedure.value)
      .subscribe((resp) => {
        this.paginatorService.length = resp.length;
        this.datasource = resp.procedures.map(({ _id, code, reference, startDate, state, group }) => ({
          id_procedure: _id,
          date: startDate,
          reference,
          group,
          state,
          code,
        }));
      });
  }

  showDetails(procedure: ProcedureTableData) {
    const params = { limit: this.paginatorService.limit, offset: this.paginatorService.offset, search: true };
    this.router.navigate(['reportes/busqueda-avanzada', procedure.group, procedure.id_procedure], {
      queryParams: params,
    });
  }

  generateReport() {
    this.paginatorService.offset = 0;
    this.saveSearchParams();
    this.search();
  }

  reset() {
    this.formProcedure.reset({});
  }

  saveSearchParams() {
    this.paginatorService.cache['form'] = this.formProcedure.value;
    this.paginatorService.cache['types'] = this.types;
  }

  loadSearchParams() {
    if (!this.paginatorService.searchMode) return;
    this.formProcedure.patchValue(this.paginatorService.cache['form'] ?? {});
    this.types = this.paginatorService.cache['types'] ?? [];
    this.search();
  }
  
  get statesProcedure() {
    return Object.values(stateProcedure);
  }
}
