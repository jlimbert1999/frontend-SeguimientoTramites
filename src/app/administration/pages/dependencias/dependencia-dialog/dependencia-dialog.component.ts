import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { dependency } from 'src/app/administration/interfaces';
import { DependenciasService } from 'src/app/administration/services/dependencias.service';
import { MatSelectSearchData } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-dependencia-dialog',
  templateUrl: './dependencia-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependenciaDialogComponent implements OnInit {
  institutions = signal<MatSelectSearchData<string>[]>([]);
  FormDependency: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    codigo: ['', Validators.required],
    sigla: ['', [Validators.required, Validators.maxLength(10)]],
    institucion: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DependenciaDialogComponent>,
    private dependenciasService: DependenciasService,
    @Inject(MAT_DIALOG_DATA) public dependency?: dependency
  ) {}

  ngOnInit(): void {
    if (this.dependency) {
      this.FormDependency.removeControl('institucion');
      this.FormDependency.patchValue(this.dependency);
    } else {
      this.dependenciasService
        .getInstitutions()
        .subscribe((data) => this.institutions.set(data.map((inst) => ({ value: inst._id, text: inst.nombre }))));
    }
  }

  save() {
    const subscription = this.dependency
      ? this.dependenciasService.edit(this.dependency._id, this.FormDependency.value)
      : this.dependenciasService.add(this.FormDependency.value);
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  selectInstitution(id_institution: string) {
    this.FormDependency.get('institucion')?.setValue(id_institution);
  }
}
