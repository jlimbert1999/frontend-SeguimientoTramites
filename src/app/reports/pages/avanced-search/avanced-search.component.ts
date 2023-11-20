import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { groupProcedure, procedure, stateProcedure } from 'src/app/procedures/interfaces';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { typeProcedure } from 'src/app/administration/interfaces';
import { ReportService } from '../../services/report.service';
import { procedureTableColumns, procedureTableData } from '../../interfaces';
import { Router } from '@angular/router';
import { EnumToString } from 'src/app/procedures/helpers';

@Component({
  selector: 'app-avanced-search',
  templateUrl: './avanced-search.component.html',
  styleUrl: './avanced-search.component.scss',
})
export class AvancedSearchComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reportService: ReportService,
    private paginatorService: PaginatorService
  ) {}

  public segments: string[] = [];
  public typeProcedures: typeProcedure[] = [];
  public formProcedure: FormGroup = this.fb.group({
    code: ['', [Validators.minLength(4)]],
    state: [''],
    reference: ['', [Validators.minLength(4)]],
    type: [''],
    startDate: [''],
    endDate: ['', [Validators.minLength(4)]],
    group: ['', [Validators.minLength(4)]],
  });
  public datasource: procedure[] = [];
  public displaycolums: procedureTableColumns[] = [
    { columnDef: 'code', header: 'Alterno' },
    { columnDef: 'reference', header: 'Referencia' },
    { columnDef: 'state', header: 'Estado' },
    { columnDef: 'startDate', header: 'Fecha' },
  ];

  ngOnInit(): void {
    console.log(this.paginatorService.searchParams);
    if (this.paginatorService.searchMode) {
      this.formProcedure.patchValue(Object.fromEntries(this.paginatorService.searchParams));
      this.search()
    }
  }

  selectGroup(group: groupProcedure) {
    this.formProcedure.get('type')?.setValue('');
    this.typeProcedures = [];
    this.segments = [];
    const type = group === groupProcedure.EXTERNAL ? 'EXTERNO' : 'INTERNO';
    this.reportService.getProcedureSegments(type).subscribe((resp) => (this.segments = resp));
  }
  selectSegment(segment: string) {
    this.formProcedure.get('type')?.setValue('');
    this.typeProcedures = [];
    this.reportService.getProceduresBySegment(segment).subscribe((resp) => (this.typeProcedures = resp));
  }
  search() {
    if (!Object.values(this.formProcedure.value).some((value) => value !== '')) return;
    this.reportService
      .searchProcedureByProperties(this.paginatorService, this.formProcedure.value)
      .subscribe((resp) => {
        this.paginatorService.length = resp.length;
        this.datasource = resp.procedures;
      });
  }

  showDetails(procedure: procedureTableData) {
    const validaParams = this.reportService.getValidParamsForm(this.formProcedure.value);
    Object.entries(validaParams).forEach(([key, value]) => {
      this.paginatorService.searchParams.set(key, String(value));
    });
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
      search: true,
    };
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
    this.segments = [];
    this.typeProcedures = [];
  }

  get isSelectedGroup() {
    if (this.formProcedure.get('group')?.value === '') return false;
    return true;
  }

  get statesProcedure() {
    return Object.values(stateProcedure);
  }
}
