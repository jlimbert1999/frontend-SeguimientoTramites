import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { EnumToString } from 'src/app/procedures/helpers';
import { procedure, stateProcedure } from 'src/app/procedures/interfaces';
import { procedureTableColumns, procedureTableData } from '../../interfaces';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-avanced-search',
  templateUrl: './avanced-search.component.html',
  styleUrl: './avanced-search.component.scss',
})
export class AvancedSearchComponent implements OnInit {
  public formProcedure: FormGroup = this.fb.group({
    code: ['', [Validators.minLength(4)]],
    state: [''],
    reference: ['', [Validators.minLength(4)]],
    type: [''],
    start: [''],
    end: ['', [Validators.minLength(4)]],
    group: ['', [Validators.minLength(4)]],
  });
  public datasource: procedure[] = [];
  public displaycolums: procedureTableColumns[] = [
    { columnDef: 'code', header: 'Alterno' },
    { columnDef: 'reference', header: 'Referencia' },
    { columnDef: 'state', header: 'Estado' },
    { columnDef: 'startDate', header: 'Fecha' },
  ];
  matSelectOptions: MatSelectSearchData<string>[] = [];
  initialValue: string | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reportService: ReportService,
    public paginatorService: PaginatorService
  ) {}

  ngOnInit(): void {
    this.loadSearchParams();
    this.search();
  }
  searchTypesProcedures(text: string) {
    this.reportService.getProceduresByText(text).subscribe((types) => {
      this.matSelectOptions = types.map((type) => ({ text: type.nombre, value: type._id }));
    });
  }
  selectTypeProcedure(id: string = '') {
    this.formProcedure.get('type')?.setValue(id);
  }

  search() {
    const validParams = this.reportService.getValidParamsForm(this.formProcedure.value);
    if (Object.keys(validParams).length === 0) return;
    this.reportService.searchProcedureByProperties(this.paginatorService, validParams).subscribe((resp) => {
      this.paginatorService.length = resp.length;
      this.datasource = resp.procedures;
    });
  }

  showDetails(procedure: procedureTableData) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
      search: true,
    };
    this.saveSearchParams();
    this.router.navigate(['reportes', 'busqueda-avanzada', EnumToString(procedure.group), procedure._id], {
      queryParams: params,
    });
  }

  generateReport() {
    this.paginatorService.offset = 0;
    this.search();
  }

  reset() {
    this.formProcedure.reset({});
  }

  saveSearchParams() {
    const validParams = this.reportService.getValidParamsForm(this.formProcedure.value);
    this.paginatorService.searchParams = new Map(Object.entries(validParams));
    this.paginatorService.cacheStore['matSelectOptions'] = this.matSelectOptions;
  }
  loadSearchParams() {
    if (!this.paginatorService.searchMode) return;
    this.formProcedure.patchValue(Object.fromEntries(this.paginatorService.searchParams));
    this.matSelectOptions = this.paginatorService.cacheStore['matSelectOptions'];
    this.initialValue = this.formProcedure.get('type')?.value;
  }
  get statesProcedure() {
    return Object.values(stateProcedure);
  }
}
