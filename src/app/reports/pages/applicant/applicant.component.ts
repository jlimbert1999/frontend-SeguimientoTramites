import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { typeApplicant } from 'src/app/procedures/interfaces';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { ReportService } from '../../services/report.service';
import { ProcedureTableColumns, ProcedureTableData } from '../../interfaces';
import { PDFGenerator } from 'src/app/shared/helpers/pdfs/pdf.config';

type applicant = 'solicitante' | 'representante';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantComponent implements OnInit {
  pdf = new PDFGenerator();
  public typeSearch: applicant = 'solicitante';
  public typeApplicant: typeApplicant = 'NATURAL';
  public formApplicant: FormGroup = this.buildFormByTypeApplicat();
  public datasource = signal<ProcedureTableData[]>([]);
  public displaycolums: ProcedureTableColumns[] = [
    { columnDef: 'code', header: 'Alterno' },
    { columnDef: 'reference', header: 'Referencia' },
    { columnDef: 'state', header: 'Estado' },
    { columnDef: 'applicant', header: 'Solicitante' },
    { columnDef: 'date', header: 'Fecha' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reportService: ReportService,
    private paginatorService: PaginatorService
  ) {}

  ngOnInit(): void {
    this.loadSearchParams();
  }

  showDetails(procedure: ProcedureTableData) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.index,
      search: true,
    };
    this.router.navigate(['reportes/solicitante', procedure.group, procedure.id_procedure], {
      queryParams: params,
    });
  }

  search() {
    if (this.formApplicant.invalid) return;
    const applicantParams = this.reportService.getValidFormParameters(this.formApplicant.value);
    if (Object.keys(applicantParams).length <= 1) return;
    this.datasource.set([]);
    this.reportService
      .searchProcedureByApplicant(
        { limit: this.paginatorService.limit, offset: this.paginatorService.offset },
        applicantParams,
        this.typeSearch
      )
      .subscribe((resp) => {
        this.datasource.set(resp.procedures);
        this.paginatorService.length = resp.length;
      });
  }

  generateReport() {
    this.paginatorService.offset = 0;
    this.saveSearchParams();
    this.search();
    this.create();
  }
  saveSearchParams() {
    this.paginatorService.cache['form'] = this.formApplicant.value;
    this.paginatorService.cache['typeSearch'] = this.typeSearch;
    this.paginatorService.cache['typeApplicant'] = this.typeApplicant;
  }
  loadSearchParams() {
    this.typeSearch = this.paginatorService.cache['typeSearch'] ?? 'solicitante';
    this.typeApplicant = this.paginatorService.cache['typeApplicant'] ?? 'NATURAL';
    this.formApplicant = this.buildFormByTypeApplicat();
    this.formApplicant.patchValue(this.paginatorService.cache['form']);
    if (!this.paginatorService.searchMode) return;
    this.search();
  }
  changeTypeSearch() {
    this.typeApplicant = 'NATURAL';
    this.formApplicant = this.buildFormByTypeApplicat();
  }
  buildFormByTypeApplicat(): FormGroup {
    if (this.typeApplicant === 'NATURAL') {
      return this.fb.group({
        nombre: ['', [Validators.minLength(3)]],
        paterno: ['', [Validators.minLength(3)]],
        materno: ['', [Validators.minLength(3)]],
        telefono: ['', [Validators.minLength(7)]],
        dni: ['', [Validators.minLength(6)]],
        tipo: ['NATURAL'],
      });
    }
    return this.fb.group({
      nombre: ['', [Validators.minLength(3)]],
      telefono: ['', [Validators.minLength(6)]],
      tipo: ['JURIDICO'],
    });
  }
  create() {
    this.pdf.createMethod();
  }
}
