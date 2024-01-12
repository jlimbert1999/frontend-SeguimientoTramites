import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolService } from '../../services/rol.service';
import { systemModule, resource, role } from '../../interfaces/role.interface';
import { systemResource } from '../../interfaces';
import { RoleDto } from '../../dto';

enum validResources {
  external = 'external',
  internal = 'internal',
  archived = 'archived',
  communication = 'communication',
  typeProcedures = 'types-procedures',
  officers = 'officers',
  accounts = 'accounts',
  dependencies = 'dependencies',
  institutions = 'institutions',
  jobs = 'jobs',
  roles = 'roles',
  reports = 'roles',
}

@Component({
  selector: 'app-rol-dialog',
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolDialogComponent implements OnInit {
  name = new FormControl('', { nonNullable: true });
  systemResources = [
    {
      value: validResources.external,
      isSelected: false,
      label: 'Externos',
      actions: [
        { value: 'create', label: 'Crear', isSelected: false },
        { value: 'read', label: 'Ver', isSelected: false },
        { value: 'update', label: 'Editar', isSelected: false },
        { value: 'delete', label: 'Eliminar', isSelected: false },
      ],
    },
    {
      value: validResources.internal,
      isSelected: false,
      label: 'Internos',
      actions: [
        { value: 'create', label: 'Crear', isSelected: false },
        { value: 'read', label: 'Ver', isSelected: false },
        { value: 'update', label: 'Editar', isSelected: false },
        { value: 'delete', label: 'Eliminar', isSelected: false },
      ],
    },
    {
      value: validResources.reports,
      label: 'Reportes',
      isSelected: false,
      actions: [
        { value: 'advanced-search', label: 'Busqueda avanzada', isSelected: false },
        { value: 'quick-search', label: 'Busqueda rapida', isSelected: false },
        { value: 'simple-search', label: 'Busqueda simple', isSelected: false },
        { value: 'applicant', label: 'Solicitante', isSelected: false },
      ],
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: role,
    public dialogRef: MatDialogRef<RolDialogComponent>,
    private rolService: RolService
  ) {}

  ngOnInit(): void {}

  save() {
    const hasPermissions = this.systemResources.some((resource) =>
      resource.actions.some((action) => action.isSelected)
    );
    // if (this.name.invalid || !hasPermissions) {
    //   return;
    // }
    // this.rolService.add(this.name.value, this.systemResources).subscribe((resp) => {
    //   console.log(resp);
    // });
  }

  setAllPermissions(index: number, isSelected: boolean) {
    this.systemResources[index].isSelected = isSelected;
    this.systemResources[index].actions.forEach((t) => (t.isSelected = isSelected));
  }

  updateAllComplete(index: number) {
    this.systemResources[index].isSelected = this.systemResources[index].actions.every((action) => action.isSelected);
  }

  someComplete(index: number): boolean {
    return (
      this.systemResources[index].actions.filter((action) => action.isSelected).length > 0 &&
      !this.systemResources[index].isSelected
    );
  }
}
