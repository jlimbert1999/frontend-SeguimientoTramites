import { ChangeDetectionStrategy, Component, signal, type OnInit, inject, DestroyRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { PaginatorService } from 'src/app/shared/services';
import { ReportService } from '../../services/report.service';

import { groupProcedure } from 'src/app/procedures/interfaces';
import { ProcedureTableColumns, ProcedureTableData } from '../../interfaces';

interface SearchData {
  form: Object;
  data: ProcedureTableData[];
}
@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickSearchComponent implements OnInit {
  public displaycolums: ProcedureTableColumns[] = [
    { columnDef: 'code', header: 'Alterno' },
    { columnDef: 'reference', header: 'Referencia' },
    { columnDef: 'state', header: 'Estado' },
    { columnDef: 'date', header: 'Fecha' },
  ];
  datasource = signal<ProcedureTableData[]>([]);
  groups = [
    {
      value: undefined,
      label: '-',
    },
    {
      value: groupProcedure.EXTERNAL,
      label: 'Tramites: EXTERNOS',
    },
    {
      value: groupProcedure.INTERNAL,
      label: 'Tramites: INTERNOS',
    },
  ];
  public FormSearch = this.fb.group({
    code: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9-]*$')]],
    group: [''],
  });
  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private paginatorService: PaginatorService<SearchData>
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.savePaginationData();
      this.paginatorService.keepAliveData = false;
    });
  }

  ngOnInit(): void {
    this.loadPaginationData();
  }

  search() {
    this.reportService
      .searchProceduresByCode({
        code: this.FormSearch.get('code')?.value!,
        group: this.FormSearch.get('group')?.value! as groupProcedure,
        ...this.paginatorService.PaginationParams,
      })
      .subscribe((data) => {
        this.paginatorService.length = data.length;
        this.datasource.set(data.procedure);
      });
  }

  private loadPaginationData() {
    const savedData = this.paginatorService.cache[this.constructor.name];
    if (!this.paginatorService.keepAliveData || !savedData) return;
    this.FormSearch.patchValue(savedData.form);
    this.datasource.set(savedData.data);
  }

  private savePaginationData() {
    this.paginatorService.cache[this.constructor.name] = {
      form: this.FormSearch.value,
      data: this.datasource(),
    };
  }

  get PageParams() {
    return { path: 'busqueda-rapida', queryParams: this.paginatorService.PageParams };
  }
}
