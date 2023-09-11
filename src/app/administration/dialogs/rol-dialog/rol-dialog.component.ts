import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolService } from '../../services/rol.service';
import { systemModule, resource, role } from '../../interfaces/role.interface';

@Component({
  selector: 'app-rol-dialog',
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.scss'],
})
export class RolDialogComponent implements OnInit {
  modules: systemModule[] = [];
  selectedModules: resource[] = [];
  roleForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    permissions: this.fb.array([], this.minLengthFormGroupArray(1)),
  });

  constructor(
    public dialogRef: MatDialogRef<RolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: role,
    private fb: FormBuilder,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.rolService.getResources().subscribe((resp) => {
      this.modules = resp;
      console.log(this.modules);
      if (this.data) {
        this.roleForm.patchValue(this.data);
        this.data.permissions.forEach((element) => {
          const permissionForm = this.fb.group({
            resource: [element.resource, Validators.required],
            actions: [element.actions, Validators.required],
          });
          this.permissions.push(permissionForm);
          this.disableSelectedModule(element.resource, true);
        });
      }
    });
  }

  get permissions() {
    return this.roleForm.controls['permissions'] as FormArray;
  }

  addPermission(resource: resource) {
    const permissionForm = this.fb.group({
      resource: [resource.value, Validators.required],
      actions: [[], Validators.required],
    });
    this.permissions.push(permissionForm);
    this.disableSelectedModule(resource.value, true);
  }

  removePrivilege(position: number) {
    this.permissions.removeAt(position);
    this.disableSelectedModule(this.selectedModules[position].value, false);
  }

  disableSelectedModule(resourceValue: string, isDisabled: boolean) {
    this.modules.forEach((module, index) => {
      const positionResource = module.resources.findIndex(
        (resource) => resource.value === resourceValue
      );
      if (positionResource > -1) {
        this.modules[index].resources[positionResource].disabled = isDisabled;
        if (isDisabled) {
          this.selectedModules.push(module.resources[positionResource]);
        } else {
          this.selectedModules = this.selectedModules.filter(
            (item) => item.value !== resourceValue
          );
        }
        return;
      }
    });
  }

  save() {
    if (this.data) {
      this.rolService
        .edit(this.data._id, this.roleForm.value)
        .subscribe((role) => {
          this.dialogRef.close(role);
        });
    } else {
      this.rolService.add(this.roleForm.value).subscribe((role) => {
        this.dialogRef.close(role);
      });
    }
  }

  minLengthFormGroupArray(min: number): ValidatorFn | any {
    return (control: AbstractControl[]) => {
      if (!(control instanceof FormArray)) return;
      return control.length < min ? { minLength: true } : null;
    };
  }
}
