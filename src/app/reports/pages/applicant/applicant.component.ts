import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PaginatorService, PdfGeneratorService } from 'src/app/shared/services';
import { typeApplicant } from 'src/app/procedures/interfaces';
import { ReportService } from '../../services/report.service';
import { ProcedureTableColumns, ProcedureTableData } from '../../interfaces';

type validReportType = 'solicitante' | 'representante';
interface SearchParams {
  form: Object;
  typeSearch: validReportType;
  typeApplicant: typeApplicant;
  data: ProcedureTableData[];
}
@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantComponent implements OnInit {
  public typeSearch = signal<validReportType>('solicitante');
  public typeApplicant = signal<typeApplicant>('NATURAL');
  public formApplicant = computed<FormGroup>(() => {
    if (this.typeSearch() === 'representante') return this.buildFormByTypeRepresentative();
    return this.typeApplicant() === 'NATURAL'
      ? this.buildFormByTypeApplicatNatural()
      : this.buildFormByTypeApplicatJuridico();
  });
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
    private paginatorService: PaginatorService<SearchParams>,
    private pdf: PdfGeneratorService
  ) {}

  ngOnInit(): void {
    this.loadSearchParams();
  }

  search() {
    const applicantProps = this.reportService.removeEmptyValuesFromObject(this.formApplicant().value);
    if (Object.keys(applicantProps).length === 0 && this.typeSearch() === 'representante') return;
    if (Object.keys(applicantProps).length <= 1 && this.typeSearch() === 'solicitante') return;
    this.reportService
      .searchProcedureByApplicant(this.paginatorService.PaginationParams, applicantProps, this.typeSearch())
      .subscribe(
        (resp) => {
          this.datasource.set(resp.procedures);
          this.paginatorService.length = resp.length;
        },
        () => this.datasource.set([])
      );
  }

  generateReport() {
    this.paginatorService.offset = 0;
    this.search();
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

  generatePDF() {
    this.pdf.generateReportSheet({
      title: 'REPORTE: SOLICITANTE',
      datasource: this.datasource(),
      displayColumns: this.displaycolums,
    });
  }

  private buildFormByTypeApplicatNatural(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.minLength(3)]],
      paterno: ['', [Validators.minLength(3)]],
      materno: ['', [Validators.minLength(3)]],
      telefono: ['', [Validators.minLength(7)]],
      dni: ['', [Validators.minLength(6)]],
      tipo: ['NATURAL'],
    });
  }
  private buildFormByTypeApplicatJuridico(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.minLength(3)]],
      telefono: ['', [Validators.minLength(6)]],
      tipo: ['JURIDICO'],
    });
  }
  private buildFormByTypeRepresentative(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.minLength(3)]],
      paterno: ['', [Validators.minLength(3)]],
      materno: ['', [Validators.minLength(3)]],
      telefono: ['', [Validators.minLength(7)]],
      dni: ['', [Validators.minLength(6)]],
    });
  }

  private saveData() {
    this.paginatorService.cache[this.constructor.name] = {
      form: this.formApplicant().value,
      typeSearch: this.typeSearch(),
      typeApplicant: this.typeApplicant(),
      data: this.datasource(),
    };
  }

  private loadSearchParams() {
    if (!this.paginatorService.searchMode() || !this.paginatorService.cache[this.constructor.name]) {
      this.paginatorService.length = 0;
      return;
    }
    const { data, form, typeApplicant, typeSearch } = this.paginatorService.cache[this.constructor.name];
    this.datasource.set(data);
    this.typeApplicant.set(typeApplicant);
    this.typeSearch.set(typeSearch);
    this.formApplicant().patchValue(form);
  }
}
