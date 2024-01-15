import { ChangeDetectionStrategy, Component, signal, type OnInit, inject, DestroyRef, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PaginatorService } from 'src/app/shared/services';
import { ReportService } from '../../services/report.service';

import { groupProcedure, stateProcedure } from 'src/app/procedures/interfaces';
import { ProcedureTableColumns, ProcedureTableData } from '../../interfaces';
import { MatSelectSearchData } from 'src/app/shared/interfaces';

type SearchMode = 'simple' | 'advanced';
interface SearchParams {
  form: Object;
  types: MatSelectSearchData<string>[];
  data: ProcedureTableData[];
  searchMode: SearchMode;
  panelIsOpened: boolean;
}

@Component({
  selector: 'app-search-procedure',
  templateUrl: './search-procedure.component.html',
  styles: `
  .button-row .mat-mdc-button-base {
    margin: 8px 8px 8px 0;
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchProcedureComponent implements OnInit {
  public panelIsOpened = signal<boolean>(true);
  public searchMode = signal<SearchMode>('simple');
  public types = signal<MatSelectSearchData<string>[]>([]);
  public formProcedure = computed(() => {
    return this.searchMode() === 'simple' ? this.createSimpleForm() : this.createAdvancedForm();
  });
  public datasource = signal<ProcedureTableData[]>([]);
  public displaycolums: ProcedureTableColumns[] = [
    { columnDef: 'code', header: 'Alterno' },
    { columnDef: 'reference', header: 'Referencia' },
    { columnDef: 'state', header: 'Estado' },
    { columnDef: 'date', header: 'Fecha' },
  ];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private paginatorService: PaginatorService<SearchParams>
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.savePaginationData();
      this.paginatorService.keepAliveData = true;
    });
  }

  ngOnInit(): void {
    this.loadPaginationData();
  }

  searchTypesProcedures(text: string) {
    this.reportService.getProceduresByText(text).subscribe((types) => {
      this.types.set(types.map((el) => ({ value: el._id, text: el.nombre })));
    });
  }

  selectTypeProcedure(id_type: string) {
    // this.formProcedure.get('type')?.setValue(id_type);
  }

  search() {
    if (this.formProcedure().invalid) return;
    this.reportService
      .searchProcedureByProperties(this.paginatorService.PaginationParams, this.formProcedure().value)
      .subscribe((resp) => {
        this.paginatorService.length = resp.length;
        this.datasource.set(resp.procedures);
      });
  }

  generateReport() {
    this.paginatorService.offset = 0;
    this.search();
  }

  get statesProcedure() {
    return Object.values(stateProcedure);
  }

  get currentMatSelectOption() {
    return this.formProcedure().get('type')?.value;
  }

  get PageParams() {
    return { path: 'busqueda-avanzada', queryParams: this.paginatorService.PageParams };
  }

  selectSearchMode(value: SearchMode) {
    this.panelIsOpened.set(true);
    this.searchMode.set(value);
  }

  togglePanel() {
    this.panelIsOpened.update((value) => !value);
  }

  resetForm() {
    this.formProcedure().reset({});
    this.datasource.set([]);
  }

  private savePaginationData() {
    this.paginatorService.cache[this.constructor.name] = {
      form: this.formProcedure().value,
      types: this.types(),
      data: this.datasource(),
      searchMode: this.searchMode(),
      panelIsOpened: this.panelIsOpened(),
    };
  }

  private loadPaginationData() {
    const cacheData = this.paginatorService.cache[this.constructor.name];
    if (!this.paginatorService.keepAliveData || !cacheData) return;
    this.searchMode.set(cacheData.searchMode);
    this.formProcedure().patchValue(cacheData.form);
    this.types.set(cacheData.types);
    this.datasource.set(cacheData.data);
    this.panelIsOpened.set(cacheData.panelIsOpened);
  }

  private createSimpleForm(): FormGroup {
    return this.fb.group({
      code: ['', [Validators.minLength(4), Validators.required]],
      group: [''],
    });
  }

  private createAdvancedForm(): FormGroup {
    return this.fb.group({
      code: ['', [Validators.minLength(4), Validators.required]],
      state: [''],
      reference: [''],
      type: [''],
      start: ['', Validators.required],
      end: [new Date(), Validators.required],
      group: [''],
      cite: [''],
    });
  }
}
