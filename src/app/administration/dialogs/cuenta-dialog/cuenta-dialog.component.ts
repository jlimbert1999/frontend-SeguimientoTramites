import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CuentaService } from 'src/app/administration/services/cuenta.service';
import { PdfGeneratorService } from 'src/app/shared/services';

import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { account, role } from '../../interfaces';

@Component({
  selector: 'app-cuenta-dialog',
  templateUrl: './cuenta-dialog.component.html',
  styleUrls: ['./cuenta-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuentaDialogComponent implements OnInit {
  institutions = signal<MatSelectSearchData<string>[]>([]);
  dependencies = signal<MatSelectSearchData<string>[]>([]);
  jobs = signal<MatSelectSearchData<string>[]>([]);
  roles = signal<role[]>([]);
  hidePassword = true;
  FormOfficer: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(6), Validators.maxLength(8)]],
    telefono: [
      '',
      [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(6), Validators.maxLength(8)],
    ],
    cargo: ['', Validators.required],
    direccion: ['SACABA', Validators.required],
  });
  FormAccount: FormGroup = this.fb.group({
    login: ['', [Validators.required, Validators.pattern(/^\S+$/), Validators.minLength(4), Validators.maxLength(10)]],
    password: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    rol: ['', Validators.required],
    dependencia: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: account,
    public dialogRef: MatDialogRef<CuentaDialogComponent>,
    private cuentasService: CuentaService,
    private pdfService: PdfGeneratorService
  ) {}

  ngOnInit(): void {
    this.getRoles();
  }

  save() {
    this.cuentasService.add(this.FormAccount.value, this.FormOfficer.value).subscribe((account) => {
      this.pdfService.createAccountSheet(account, this.FormAccount.get('password')?.value);
      this.dialogRef.close(account);
    });
  }
  getRoles() {
    this.cuentasService.getRoles().subscribe((roles) => this.roles.set(roles));
  }
  searchInstitutions(term: string) {
    this.cuentasService.getInstitutions(term).subscribe((data) => {
      this.institutions.set(data.map((inst) => ({ text: inst.nombre, value: inst._id })));
    });
  }
  searchDependencies(id_institucion: string) {
    this.cuentasService.getDependenciesOfInstitution(id_institucion).subscribe((data) => {
      this.dependencies.set(data.map((dependency) => ({ value: dependency._id, text: dependency.nombre })));
    });
  }
  selectDependency(id_dependency: string) {
    this.FormAccount.get('dependencia')?.setValue(id_dependency);
  }

  searchJob(term: string) {
    this.cuentasService.searchJobsForOfficer(term).subscribe((data) => {
      this.jobs.set(data.map((job) => ({ value: job._id, text: job.nombre })));
    });
  }
  selectJob(id_job: string) {
    this.FormOfficer.get('cargo')?.setValue(id_job);
  }
  generateCrendentials() {
    const { nombre = '', paterno = '', dni = '', materno = '' } = this.FormOfficer.value;
    const login = nombre.charAt(0) + paterno + materno.charAt(0);
    this.FormAccount.get('login')?.setValue(login.trim().toUpperCase());
    this.FormAccount.get('password')?.setValue(dni.trim());
  }

  get validForms() {
    return this.FormAccount.valid && this.FormOfficer.valid;
  }

  getErrorMessagesForm(control: AbstractControl) {
    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control.hasError('pattern')) {
      return 'El campo no puede contener espacios en blanco';
    }
    if (control.hasError('minlength')) {
      return 'El campo debe tener al menos 4 caracteres';
    }
    if (control.hasError('maxlength')) {
      return 'El campo no puede tener más de 10 caracteres';
    }
    return '';
  }
}
