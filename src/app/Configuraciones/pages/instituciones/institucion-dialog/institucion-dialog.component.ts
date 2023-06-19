import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { institution } from 'src/app/Configuraciones/interfaces/institution.interface';
import { InstitucionesService } from 'src/app/Configuraciones/services/instituciones.service';


@Component({
  selector: 'app-institucion-dialog',
  templateUrl: './institucion-dialog.component.html',
  styleUrls: ['./institucion-dialog.component.scss']
})
export class InstitucionDialogComponent implements OnInit {
  Form_Institucion: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    sigla: ['', [Validators.required, Validators.maxLength(10)]]
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: institution | undefined,
    public dialogRef: MatDialogRef<InstitucionDialogComponent>,
    private institucionesService: InstitucionesService
  ) { }

  ngOnInit(): void {
    if (this.data) this.Form_Institucion.patchValue(this.data)
  }

  guardar() {
    if (this.data) {
      this.institucionesService.edit(this.data._id, this.Form_Institucion.value).subscribe(inst => {
        this.dialogRef.close(inst)
      })
    }
    else {
      this.institucionesService.add(this.Form_Institucion.value).subscribe(inst => {
        this.dialogRef.close(inst)
      })
    }
  }


}
