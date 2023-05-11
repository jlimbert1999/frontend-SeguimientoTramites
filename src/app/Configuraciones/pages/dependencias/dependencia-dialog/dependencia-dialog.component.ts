import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DependenciaModel } from 'src/app/Configuraciones/models/dependencia.model';
import { DependenciasService } from 'src/app/Configuraciones/services/dependencias.service';


@Component({
  selector: 'app-dependencia-dialog',
  templateUrl: './dependencia-dialog.component.html',
  styleUrls: ['./dependencia-dialog.component.scss'],
})
export class DependenciaDialogComponent implements OnInit {
  titulo: string = '';
  Instituciones: { id_institucion: string; nombre: string, sigla: string }[];

  //guardar data institucion seleccionada
  institucion: { id_institucion: string; nombre: string, sigla: string };

  Form_Dependencia: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    sigla: ['', [Validators.required, Validators.maxLength(10)]],
    institucion: ['', Validators.required],
    codigo: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DependenciaModel,
    public dialogRef: MatDialogRef<DependenciaDialogComponent>,
    private dependenciasService: DependenciasService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.titulo = 'Edicion';
      this.Form_Dependencia = this.fb.group({
        nombre: ['', Validators.required],
        sigla: ['', [Validators.required, Validators.maxLength(10)]],
        codigo: ['', Validators.required],
      });
      this.Form_Dependencia.patchValue(this.data);
    } else {
      this.titulo = 'Registro';
      this.dependenciasService
        .getInstituciones()
        .subscribe((inst) => (this.Instituciones = inst));
    }
  }
  guardar() {
    if (this.Form_Dependencia.valid) {
      if (this.data) {
        this.dependenciasService.edit(
          this.data.id_dependencia!, this.Form_Dependencia.value
        ).subscribe(dep => this.dialogRef.close(dep));
      } else {
        this.dependenciasService
          .add(this.Form_Dependencia.value)
          .subscribe(dep => {
            dep.institucion = {
              sigla: this.institucion.sigla,
              _id: this.institucion.id_institucion
            }
            this.dialogRef.close(dep);
          });
      }
    }
  }
}
