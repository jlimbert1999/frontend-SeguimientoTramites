import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PaginatorService, PdfGeneratorService } from 'src/app/shared/services';
import { typeApplicant } from 'src/app/procedures/interfaces';
import { ReportService } from '../../services/report.service';
import { ProcedureTableColumns, ProcedureTableData } from '../../interfaces';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;
  public typeSearch: 'solicitante' | 'representante' = 'solicitante';
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
    private paginatorService: PaginatorService,
    private pdf: PdfGeneratorService
  ) {}

  ngOnInit(): void {
    this.loadSearchParams();
  }

  search() {
    if (this.formApplicant.invalid) return;
    const applicantParams = this.reportService.getValidFormParameters(this.formApplicant.value);
    if (Object.keys(applicantParams).length <= 1) return;
    this.datasource.set([]);
    this.reportService
      .searchProcedureByApplicant(this.paginatorService.PaginationParams, applicantParams, this.typeSearch)
      .subscribe((resp) => {
        this.datasource.set(resp.procedures);
        this.paginatorService.length = resp.length;
      });
  }

  generateReport() {
    this.paginatorService.offset = 0;
    this.search();
  }

  changeTypeSearch() {
    this.typeApplicant = 'NATURAL';
    this.formApplicant = this.buildFormByTypeApplicat();
  }
  changeTypeApplicant() {
    this.formApplicant = this.buildFormByTypeApplicat();
  }
  showDetails(procedure: ProcedureTableData) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.index,
      search: true,
    };
    this.saveData();
    this.router.navigate(['reportes/solicitante', procedure.group, procedure.id_procedure], {
      queryParams: params,
    });
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
  generatePDF() {
    this.pdf.generateReportSheet({
      title: 'REPORTE: SOLICITANTE',
      datasource: this.datasource(),
      displayColumns: this.displaycolums,
    });
  }
  private saveData() {
    this.paginatorService.cache['form'] = this.formApplicant.value;
    this.paginatorService.cache['typeSearch'] = this.typeSearch;
    this.paginatorService.cache['typeApplicant'] = this.typeApplicant;
    this.paginatorService.cache['data'] = this.datasource();
    this.paginatorService.cache['length'] = this.paginatorService.length;
  }
  private loadSearchParams() {
    if (!this.paginatorService.searchMode) return;
    this.typeSearch = this.paginatorService.cache['typeSearch'] ?? 'solicitante';
    this.typeApplicant = this.paginatorService.cache['typeApplicant'] ?? 'NATURAL';
    this.formApplicant = this.buildFormByTypeApplicat();
    this.formApplicant.patchValue(this.paginatorService.cache['form']);
    this.datasource.set(this.paginatorService.cache['data'] ?? []);
    this.paginatorService.length = this.paginatorService.cache['length'] ?? 0;
  }
}
