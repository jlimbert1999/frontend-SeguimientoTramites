import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { dependency } from 'src/app/Configuraciones/interfaces/dependency.interface';
import { institution } from 'src/app/Configuraciones/interfaces/institution.interface';
import { DependenciasService } from 'src/app/Configuraciones/services/dependencias.service';

@Component({
  selector: 'app-dependencia-dialog',
  templateUrl: './dependencia-dialog.component.html',
  styleUrls: ['./dependencia-dialog.component.scss'],
})
export class DependenciaDialogComponent implements OnInit {
  institutions: institution[] = []
  Form_Dependencia: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    sigla: ['', [Validators.required, Validators.maxLength(10)]],
    institucion: ['', Validators.required],
    codigo: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: dependency,
    public dialogRef: MatDialogRef<DependenciaDialogComponent>,
    private dependenciasService: DependenciasService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.Form_Dependencia = this.fb.group({
        nombre: ['', Validators.required],
        sigla: ['', [Validators.required, Validators.maxLength(10)]],
        codigo: ['', Validators.required],
      });
      this.Form_Dependencia.patchValue(this.data);
    } else {
      this.dependenciasService
        .getInstitutions()
        .subscribe((inst) => (this.institutions = inst));
    }
  }

  guardar() {
    if (this.data) {
      this.dependenciasService.edit(
        this.data._id, this.Form_Dependencia.value
      ).subscribe(dep => this.dialogRef.close(dep));
    } else {
      this.dependenciasService.add(this.Form_Dependencia.value)
        .subscribe(dep => {
          this.dialogRef.close(dep);
        });
    }
  }
}
