import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InstitucionModel } from '../../models/institucion.model';
import { InstitucionesService } from '../../services/instituciones.service';

@Component({
  selector: 'app-institucion-dialog',
  templateUrl: './institucion-dialog.component.html',
  styleUrls: ['./institucion-dialog.component.css']
})
export class InstitucionDialogComponent implements OnInit {
  titulo: string = ''
  Form_Institucion: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    sigla: ['', [Validators.required, Validators.maxLength(10)]]
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: InstitucionModel,
    public dialogRef: MatDialogRef<InstitucionDialogComponent>,
    private institucionesService: InstitucionesService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.titulo = 'Edicion'
      this.Form_Institucion.patchValue(this.data)
    }
    else {
      this.titulo = 'Registro'
    }

  }

  guardar() {
    if (this.Form_Institucion.valid) {
      if (this.data) {
        this.institucionesService.actualizar_institucion(this.data.id_institucion!, this.Form_Institucion.value).subscribe(inst => {
          this.dialogRef.close(inst)
        })
      }
      else {
        this.institucionesService.agregar_institucion(this.Form_Institucion.value).subscribe(inst => {
          this.dialogRef.close(inst)
        })
      }

    }
  }


}
