import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolService } from '../../services/rol.service';
import { Rol, RolDto } from '../../models/rol.model';

@Component({
  selector: 'app-rol-dialog',
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.scss']
})
export class RolDialogComponent implements OnInit {
  Form_Role: FormGroup = this.fb.group({
    role: ['', Validators.required],
    privileges: this.fb.array([])
  });
  modules = [
    {
      group: 'Administracion tramites',
      resources: [
        { value: 'externos', viewValue: 'Externos', disabled: false },
        { value: 'internos', viewValue: 'Internos', disabled: false },
        { value: 'archivos', viewValue: 'Archivos', disabled: false }
      ],
    },
    {
      group: 'Administracion envios',
      resources: [
        { value: 'entradas', viewValue: 'Entrada', disabled: false },
        { value: 'salidas', viewValue: 'Salida', disabled: false },
      ],
    },
    {
      group: 'Reportes',
      resources: [
        { value: 'reporte-solicitante', viewValue: 'Reporte solicitante', disabled: false },
        { value: 'reporte-tipo', viewValue: 'Reporte tipo', disabled: false },
        { value: 'reporte-unidad', viewValue: 'Reporte unidad', disabled: false },
        { value: 'reporte-usuario', viewValue: 'Reporte usuario', disabled: false },
        { value: 'reporte-ficha', viewValue: 'Reporte ficha', disabled: false },
        { value: 'busquedas', viewValue: 'Busquedas', disabled: false },
      ],
    },
    {
      group: 'Configuraciones',
      resources: [
        { value: 'tipos', viewValue: 'Tipos de Tramites', disabled: false },
        { value: 'usuarios', viewValue: 'Funcionarios', disabled: false },
        { value: 'roles', viewValue: 'Roles', disabled: false },
        { value: 'cuentas', viewValue: 'Cuentas', disabled: false },
        { value: 'instituciones', viewValue: 'Instituciones', disabled: false },
        { value: 'dependencias', viewValue: 'Dependencias', disabled: false },
      ],
    },
  ]



  constructor(
    public dialogRef: MatDialogRef<RolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Rol,
    private fb: FormBuilder,
    private rolService: RolService
  ) {


  }
  ngOnInit(): void {
    if (this.data) {
      // create form for charge data
      for (let index = 0; index < this.data.privileges.length; index++) {
        const priviligeForm = this.fb.group({
          resource: ['', Validators.required],
          create: false,
          update: false,
          read: false,
          delete: false
        });
        this.privileges.push(priviligeForm);
        this.disableModule(this.data.privileges[index].resource, true)
      }
      this.Form_Role.patchValue(this.data)
    }
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
    // this.privileges.(priviligeForm);
  }

  removePrivilege(lessonIndex: number) {
    const value = this.privileges.at(lessonIndex).value
    this.disableModule(value.resource, false)
    this.privileges.removeAt(lessonIndex);
  }


  disableModule(value: string, disable: boolean) {
    // disable or enable modules if selected
    this.modules.map(module => {
      const pos = module.resources.findIndex(resource => resource.value === value)
      if (pos !== -1) module.resources[pos].disabled = disable
      return module
    })
  }



  Save() {
    console.log(this.Form_Role.value);
    // if (this.data) {
    //   this.rolService.edit(this.data._id, this.Form_Role.value).subscribe(Rol => {
    //     this.dialogRef.close(Rol)
    //   })
    // }
    // else {
    //   this.rolService.add(this.Form_Role.value).subscribe(Rol => {
    //     this.dialogRef.close(Rol)
    //   })
    // }

  }
}
