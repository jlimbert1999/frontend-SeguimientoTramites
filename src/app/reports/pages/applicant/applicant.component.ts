import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { typeApplicant } from 'src/app/procedures/interfaces';
import { EnumToString } from 'src/app/procedures/helpers';

import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { ReportService } from '../../services/report.service';
import { searchParamsApplicant, tableProcedureData } from '../../interfaces';

type validSearchProperty = 'solicitante' | 'representante';
@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrl: './applicant.component.scss',
})
export class ApplicantComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _reportService = inject(ReportService);
  private paginatorService = inject(PaginatorService);
  private router = inject(Router);

  public datasource: tableProcedureData[] = [];
  public typeApplicant: typeApplicant = 'NATURAL';
  public typeSearch: validSearchProperty = 'solicitante';
  public formApplicant: FormGroup;

  ngOnInit(): void {
    this.changeFormApplicant();
    if (!this.paginatorService.searchMode) return;
    this.restartSearchParams();
    this.search();
  }
  changeFormApplicant() {
    this.formApplicant =
      this.typeApplicant === 'NATURAL'
        ? this._fb.group({
            nombre: ['', [Validators.minLength(3)]],
            paterno: ['', [Validators.minLength(3)]],
            materno: ['', [Validators.minLength(3)]],
            telefono: ['', [Validators.minLength(7)]],
            dni: ['', [Validators.minLength(7)]],
          })
        : this._fb.group({
            nombre: ['', [Validators.minLength(3)]],
            telefono: ['', [Validators.minLength(7)]],
          });
  }
  changeTypeSearch() {
    this.typeApplicant = 'NATURAL';
    this.datasource = [];
    this.changeFormApplicant();
  }

  showDetails(procedure: tableProcedureData) {
    Object.entries(this.formApplicant.value).forEach(([key, value]) => {
      this.paginatorService.searchParams.set(key, String(value));
    });
    this.paginatorService.searchParams.set('typeApplicant', this.typeApplicant);
    this.paginatorService.searchParams.set('typeSearch', this.typeSearch);
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
      search: true,
    };
    this.router.navigate(['reportes', 'solicitante', EnumToString(procedure.group), procedure._id], {
      queryParams: params,
    });
  }

  search() {
    const applicantProps = this.getValidParamsForm();
    applicantProps.tipo = this.typeApplicant;
    if (Object.keys(applicantProps).length === 0) return;
    this._reportService
      .searchProcedureByApplicant(
        { limit: this.paginatorService.limit, offset: this.paginatorService.offset },
        applicantProps,
        this.typeSearch
      )
      .subscribe((resp) => {
        this.datasource = resp.procedures;
        this.paginatorService.length = resp.length;
      });
  }
  generateReport() {
    this.paginatorService.offset = 0;
    this.search();
  }
  getValidParamsForm(): searchParamsApplicant {
    return Object.entries(this.formApplicant.value).reduce(
      (acc, [key, value]) => (value ? { ...acc, [key]: value } : acc),
      {}
    );
  }
  restartSearchParams() {
    this.formApplicant.patchValue(Object.fromEntries(this.paginatorService.searchParams));
    this.typeApplicant = (this.paginatorService.searchParams.get('typeApplicant') as typeApplicant) ?? 'NATURAL';
    this.typeSearch = (this.paginatorService.searchParams.get('typeSearch') as validSearchProperty) ?? 'solicitante';
  }

  resetForm() {
    this.formApplicant.reset();
    this.datasource = [];
  }
}
