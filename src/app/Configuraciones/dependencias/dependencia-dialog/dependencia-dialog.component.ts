import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DependenciaModel } from '../../models/dependencia.model';
import { InstitucionModel } from '../../models/institucion.model';
import { DependenciasService } from '../../services/dependencias.service';

@Component({
  selector: 'app-dependencia-dialog',
  templateUrl: './dependencia-dialog.component.html',
  styleUrls: ['./dependencia-dialog.component.css'],
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
      });
      this.Form_Dependencia.patchValue(this.data);
    } else {
      this.titulo = 'Registro';
      this.dependenciasService
        .obtener_instituciones_habilitadas()
        .subscribe((inst) => (this.Instituciones = inst));
    }
  }
  guardar() {
    if (this.Form_Dependencia.valid) {
      if (this.data) {
        this.dependenciasService.actualizar_dependencia(
          this.data.id_dependencia!, this.Form_Dependencia.value
        ).subscribe(dep => this.dialogRef.close(dep));
      } else {
        this.dependenciasService
          .agregar_dependencia(this.Form_Dependencia.value)
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
