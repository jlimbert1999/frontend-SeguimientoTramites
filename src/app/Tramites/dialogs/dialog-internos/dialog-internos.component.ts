import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { map, Observable, startWith, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InternosService } from '../../services/internos.service';
@Component({
  selector: 'app-dialog-internos',
  templateUrl: './dialog-internos.component.html',
  styleUrls: ['./dialog-internos.component.css']
})
export class DialogInternosComponent implements OnInit {
  filteredOptions: Observable<any[]>;
  filteredDestiny: Observable<any[]>;

  TramiteFormGroup: FormGroup = this.fb.group({
    tipo_tramite: ['', Validators.required],
    detalle: ['', Validators.required],
    cite: [this.authService.account.citeCode],
    nombre_remitente: ['', Validators.required],
    cargo_remitente: [this.authService.account.funcionario.cargo, Validators.required],
    nombre_destinatario: ['', Validators.required],
    cargo_destinatario: ['', Validators.required],
    cantidad: ['', Validators.required],
    alterno: ['']
  });

  tipos_tramites: any[] = []
  title: string

  constructor(
    private authService: AuthService,
    private internoService: InternosService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogInternosComponent>,) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.title = 'EDICION TRAMITE'
      this.TramiteFormGroup = this.fb.group({
        detalle: [this.data.detalle, Validators.required],
        cite: [this.data.cite],
        nombre_remitente: [this.data.remitente.nombre, Validators.required],
        cargo_remitente: [this.data.remitente.cargo, Validators.required],
        nombre_destinatario: [this.data.destinatario.nombre, Validators.required],
        cargo_destinatario: [this.data.destinatario.cargo, Validators.required],
        cantidad: [this.data.cantidad, Validators.required]
      });
    }
    else {
      this.title = 'REGISTRO TRAMITE'
      this.internoService.getTypes().subscribe(tipos => {
        this.tipos_tramites = tipos
      })
    }
    this.filteredOptions = this.TramiteFormGroup.controls['nombre_remitente'].valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        if (value) {
          return this.FiltrarUsuarios(value)
        }
        return []
      })
    )
    this.filteredDestiny = this.TramiteFormGroup.controls['nombre_destinatario'].valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        if (value) {
          return this.FiltrarDestinatarios(value)
        }
        return []
      })
    )
  }

  selectType(id_type: string) {
    let type = this.tipos_tramites.find(tipo => tipo.id_tipoTramite === id_type)
    this.TramiteFormGroup.get('alterno')?.setValue(`${type!.segmento}-por-hacer`)
  }

  guardar() {
    const {
      nombre_remitente,
      cargo_remitente,
      nombre_destinatario,
      cargo_destinatario,
      ...Object } = this.TramiteFormGroup.value
    let tramite: any = {
      remitente: {
        nombre: nombre_remitente,
        cargo: cargo_remitente
      },
      destinatario: {
        nombre: nombre_destinatario,
        cargo: cargo_destinatario
      },
      ...Object
    }
    this.dialogRef.close(tramite)
  }


  FiltrarUsuarios(termino: string) {
    return this.internoService.getUsers(termino)
      .pipe(
        map(response => response.users)
      )
  }
  FiltrarDestinatarios(termino: string) {
    return this.internoService.getUsers(termino)
      .pipe(
        map(response => response.users)
      )
  }
  seleccionar_remitente(funcionario: any) {
    this.TramiteFormGroup.get('cargo_remitente')?.setValue(funcionario.cargo.toUpperCase())
    this.TramiteFormGroup.get('nombre_remitente')?.setValue(`${funcionario.nombre} ${funcionario.paterno} ${funcionario.materno}`.toUpperCase())
  }
  seleccionar_destinatario(funcionario: any) {
    this.TramiteFormGroup.get('cargo_destinatario')?.setValue(funcionario.cargo.toUpperCase())
    this.TramiteFormGroup.get('nombre_destinatario')?.setValue(`${funcionario.nombre} ${funcionario.paterno} ${funcionario.materno}`.toUpperCase())
  }

}
