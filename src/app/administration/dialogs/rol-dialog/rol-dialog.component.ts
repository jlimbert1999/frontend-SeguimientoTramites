import { ChangeDetectionStrategy, Component, Inject, OnInit, computed, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import { RolService } from '../../services/rol.service';
import { role } from '../../interfaces/role.interface';

import { systemResource, validResources } from '../../interfaces';
import { tree } from 'd3';
// const SystemResources =

@Component({
  selector: 'app-rol-dialog',
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolDialogComponent implements OnInit {
  name = new FormControl('', { nonNullable: true } && Validators.required);
  filterValue: string = '';
  systemResources = signal<systemResource[]>([]);
  isLoading = signal<boolean>(true);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: role,
    public dialogRef: MatDialogRef<RolDialogComponent>,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.rolService.getResources().subscribe((resources) => {
      this.systemResources.set(resources);
      this.loadPermissions();
      this.isLoading.set(false);
    });
  }

  save(): void {
    const hasPermissions = this.systemResources().some((resource) =>
      resource.actions.some((action) => action.isSelected)
    );
    if (this.name.invalid || !hasPermissions) {
      return;
    }
    const subscription = this.data
      ? this.rolService.edit(this.data._id, this.name.value!, this.systemResources())
      : this.rolService.add(this.name.value!, this.systemResources());
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  setAllPermissions(validResource: validResources, isSelected: boolean) {
    this.systemResources.update((values) => {
      const index = values.findIndex((resource) => resource.value === validResource);
      values[index].isSelected = isSelected;
      values[index].actions.forEach((action) => (action.isSelected = isSelected));
      return values;
    });
  }

  updateAllComplete(validResource: validResources) {
    this.systemResources.update((values) => {
      const index = values.findIndex((resource) => resource.value === validResource);
      values[index].isSelected = values[index].actions.every((action) => action.isSelected);
      return values;
    });
  }

  someComplete(validResource: validResources): boolean {
    const index = this.systemResources().findIndex((resource) => resource.value === validResource);
    const resorce = this.systemResources()[index];
    return resorce.actions.filter((action) => action.isSelected).length > 0 && !resorce.isSelected;
  }

  loadPermissions() {
    if (!this.data) return;
    const { name, permissions } = this.data;
    this.name.setValue(name);
    this.systemResources.update((values) => {
      permissions.forEach((permission) => {
        const index = values.findIndex((resource) => resource.value === permission.resource);
        if (index >= 0) {
          values[index].actions.forEach((action) => (action.isSelected = permission.actions.includes(action.value)));
          values[index].isSelected = values[index].actions.every((action) => action.isSelected);
        }
      });
      return values;
    });
  }
}
