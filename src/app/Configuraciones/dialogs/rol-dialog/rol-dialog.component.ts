import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rol-dialog',
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.css']
})
export class RolDialogComponent {
  Form_Role = this.fb.group({
    role: ['', Validators.required],
    privileges: this.fb.array([])
  });
  resources = [
    { value: 'externos', viewValue: 'Tramites externos' },
    { value: 'internos', viewValue: 'Tramites internos' },
    { value: 'entradas', viewValue: 'Bandeja de entrada' },
    { value: 'salidas', viewValue: 'Bandeja de salida' },
    { value: 'tipos', viewValue: 'Tipos de tramites' },
    { value: 'usuarios', viewValue: 'Administracion funcionarios' },
    { value: 'cuentas', viewValue: 'Administracion cuentas' },
    { value: 'instituciones', viewValue: 'Administracion instituciones' },
    { value: 'dependencias', viewValue: 'Administracion dependencias' },
    { value: 'reportes', viewValue: 'Reportes' },
    { value: 'busquedas', viewValue: 'Busquedas' },
    { value: 'roles', viewValue: 'Administracion de roles' },
  ]


  constructor(
    public dialogRef: MatDialogRef<RolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) {
  }
  get privileges() {
    return this.Form_Role.controls["privileges"] as FormArray;
  }

  addPrivilege() {
    const priviligeForm = this.fb.group({
      resource: ['', Validators.required],
      create: false,
      update: false,
      read: false,
      delete: false
    });

    this.privileges.push(priviligeForm);
  }
}
