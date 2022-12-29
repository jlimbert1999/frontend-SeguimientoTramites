import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.css']
})
export class UsuarioDialogComponent implements OnInit {
  titulo: string
  Form_Funcionario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', Validators.required],
    expedido: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.maxLength(8)]],
    cargo: ['', Validators.required],
    direccion: ['', Validators.required]
  });
  
  departamentos = [
    'COCHABAMBA',
    'SANTA CRUZ',
    'LA PAZ',
    'ORURO',
    'PANDO',
    'BENI',
    'CHUQUISACA',
    'TARIJA',
    'POTOSI'
  ]
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioModel,
    public dialogRef: MatDialogRef<UsuarioDialogComponent>,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.titulo = 'Edicion'
      this.Form_Funcionario.patchValue(this.data)
    }
    else {
      this.titulo = 'Registro'
    }
  }

  guardar() {
    if (this.Form_Funcionario.valid) {
      if (this.data) {
        this.usuariosService.editar_funcionario(this.data._id!, this.Form_Funcionario.value).subscribe(user => {
          this.dialogRef.close(user)
        })
      }
      else {
        this.usuariosService.agregar_funcionario(this.Form_Funcionario.value).subscribe(user => {
          this.dialogRef.close(user)
        })
      }

    }

  }

}
