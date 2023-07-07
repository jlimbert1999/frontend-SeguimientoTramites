import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { CuentaService } from 'src/app/Configuraciones/services/cuenta.service';
import { HojaUsuarios } from 'src/app/Configuraciones/pdfs/usuarios';
import { institution } from '../../interfaces/institution.interface';
import { dependency } from '../../interfaces/dependency.interface';
import { account } from '../../interfaces/account.interface';
import { role } from '../../interfaces/role.interface';
import { job } from '../../interfaces/job.interface';



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
  noJob: boolean = false

  Form_Funcionario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.maxLength(8)]],
    cargo: ['', Validators.required],
    direccion: ['', Validators.required]
  });

  Form_Cuenta: FormGroup = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
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



  guardar() {
    this.cuentasService.add(this.Form_Cuenta.value, this.Form_Funcionario.value).subscribe(cuenta => {
      // HojaUsuarios(
      //   cuenta,
      //   this.Form_Cuenta.get('login')?.value,
      //   this.Form_Cuenta.get('password')?.value
      // )
      this.dialogRef.close(cuenta)
    })
  }




  changeTab() {
    let name = this.Form_Funcionario.get('nombre')?.value.split(' ')[0]
    let firstName = this.Form_Funcionario.get('paterno')?.value[0] ? this.Form_Funcionario.get('paterno')?.value[0] : ''
    let lasttName = this.Form_Funcionario.get('materno')?.value[0] ? this.Form_Funcionario.get('materno')?.value[0] : ''
    this.Form_Cuenta.get('login')?.setValue(name + firstName + lasttName)
    this.Form_Cuenta.get('password')?.setValue(this.Form_Funcionario.get('dni')?.value)
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
    if (job) {
      this.Form_Funcionario.get('cargo')?.setValue(job._id)
    }
  }



}
