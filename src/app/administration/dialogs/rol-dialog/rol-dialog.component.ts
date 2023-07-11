import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolService } from '../../services/rol.service';
import { privilege, role } from '../../interfaces/role.interface';

@Component({
  selector: 'app-rol-dialog',
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.scss']
})
export class RolDialogComponent implements OnInit {
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
        { value: 'cargos', viewValue: 'Cargos', disabled: false },
        { value: 'roles', viewValue: 'Roles', disabled: false },
        { value: 'cuentas', viewValue: 'Cuentas', disabled: false },
        { value: 'instituciones', viewValue: 'Instituciones', disabled: false },
        { value: 'dependencias', viewValue: 'Dependencias', disabled: false },
      ],
    }
  ]
  Form_Role: FormGroup = this.fb.group({
    role: ['', Validators.required],
    privileges: this.fb.array<privilege>([], this.minLengthFormGroupArray(1))
  });

  constructor(
    public dialogRef: MatDialogRef<RolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: role,
    private fb: FormBuilder,
    private rolService: RolService
  ) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.data.privileges.forEach(privilege => {
        const priviligeForm = this.fb.group({
          resource: ['', Validators.required],
          create: false,
          update: false,
          read: false,
          delete: false
        });
        this.privileges.push(priviligeForm)
      })
      this.Form_Role.patchValue(this.data)
      this.disableSelectedModules()
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
    this.privileges.insert(0, priviligeForm);
  }

  removePrivilege(lessonIndex: number) {
    this.privileges.removeAt(lessonIndex);
    this.disableSelectedModules()
  }


  disableSelectedModules() {
    const selectedPrivileges: privilege[] = this.privileges.value
    const selectedResources = selectedPrivileges.map(el => el.resource)
    this.modules.map(module => {
      module.resources.forEach((element, index) => {
        if (selectedResources.includes(element.value)) {
          module.resources[index].disabled = true
        }
        else {
          module.resources[index].disabled = false
        }
      })
      return module
    })
  }

  save() {
    if (this.data) {
      this.rolService.edit(this.data._id, this.Form_Role.value).subscribe(role => {
        this.dialogRef.close(role)
      })
    }
    else {
      this.rolService.add(this.Form_Role.value).subscribe(role => {
        this.dialogRef.close(role)
      })
    }
  }

  minLengthFormGroupArray(min: number): ValidatorFn | any {
    return (control: AbstractControl[]) => {
      if (!(control instanceof FormArray)) return;
      return control.length < min ? { minLength: true } : null;
    }
  }
}
