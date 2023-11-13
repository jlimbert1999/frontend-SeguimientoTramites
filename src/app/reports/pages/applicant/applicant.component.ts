import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { groupProcedure, typeApplicant } from 'src/app/procedures/interfaces';
import { ReportService } from '../../services/report.service';
import { searchParamsApplicant, tableProcedureData } from '../../interfaces';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { Router } from '@angular/router';

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
  public typeSearch: 'solicitante' | 'representante' = 'solicitante';
  public formApplicant: FormGroup;

  ngOnInit(): void {
    this.changeFormApplicant();
    if (this.paginatorService.searchMode) {
      this.formApplicant.patchValue(Object.fromEntries(this.paginatorService.searchParams));
      this.search();
    }
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
    for (const [key, value] of Object.entries(this.formApplicant.value)) {
      console.log(value);
      if (value) this.paginatorService.searchParams.set(key, value as string);
    }
    this.router.navigate(['reportes', 'solicitante', 'externos', procedure._id], { queryParams: { search: true } });
  }

  search() {
    const applicantProps = Object.entries(this.formApplicant.value).reduce(
      (acc, [k, v]) => (v ? { ...acc, [k]: v } : acc),
      {}
    );
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
}
