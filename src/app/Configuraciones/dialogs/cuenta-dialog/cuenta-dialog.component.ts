import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { CuentaService } from 'src/app/Configuraciones/services/cuenta.service';
import { institution } from '../../interfaces/institution.interface';
import { dependency } from '../../interfaces/dependency.interface';
import { account } from '../../interfaces/account.interface';
import { role } from '../../interfaces/role.interface';
import { job } from '../../interfaces/job.interface';
import { createAccountPDF } from '../../helpers/pdfs/pdf-account';



@Component({
  selector: 'app-cuenta-dialog',
  templateUrl: './cuenta-dialog.component.html',
  styleUrls: ['./cuenta-dialog.component.scss'],
})
export class CuentaDialogComponent implements OnInit {
  dependencias: dependency[] = [];
  instituciones: institution[] = [];
  roles: role[] = []
  jobs: job[] = []
  hidePassword = true;

  Form_Funcionario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.maxLength(8)]],
    cargo: [null],
    direccion: ['SACABA', Validators.required]
  });

  Form_Cuenta: FormGroup = this.fb.group({
    login: ['', [Validators.required, Validators.pattern(/^\S+$/), Validators.minLength(4), Validators.maxLength(10)]],
    password: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    rol: ['', Validators.required],
    dependencia: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: account,
    public dialogRef: MatDialogRef<CuentaDialogComponent>,
    private cuentasService: CuentaService
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.cuentasService.getInstitutions(),
      this.cuentasService.getRoles()
    ]).subscribe(
      data => {
        this.instituciones = data[0]
        this.roles = data[1]
      }
    )
  }

  save() {
    this.cuentasService.add(this.Form_Funcionario.value, this.Form_Cuenta.value).subscribe(result => {
      createAccountPDF(result, this.Form_Cuenta.get('password')?.value)
      this.dialogRef.close(result)
    })
  }




  eventChangeTab() {
    const nombre: string = this.Form_Funcionario.get('nombre')?.value;
    const materno: string = this.Form_Funcionario.get('materno')?.value;
    const paterno: string = this.Form_Funcionario.get('paterno')?.value;
    const dni: string = this.Form_Funcionario.get('dni')?.value;
    const login = nombre.charAt(0) + paterno + materno.charAt(0);
    this.Form_Cuenta.get('login')?.setValue(login.trim().toUpperCase())
    this.Form_Cuenta.get('password')?.setValue(dni.trim())
  }
  getDependencies(institution: institution | null) {
    this.Form_Cuenta.get('institucion')?.setValue(institution ? institution._id : '')
    if (institution) {
      this.cuentasService.getDependencies(institution._id).subscribe(data => {
        this.dependencias = data
      })
    }
  }
  selectDependency(dependency: dependency) {
    this.Form_Cuenta.get('dependencia')?.setValue(dependency ? dependency._id : '')
  }
  searchJob(value: string) {
    this.cuentasService.getJobForOfficer(value).subscribe(data => {
      this.jobs = data
    })
  }
  selectJob(job: job | null) {
    this.Form_Funcionario.get('cargo')?.setValue(job ? job._id : null)
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
