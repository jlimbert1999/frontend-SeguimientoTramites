import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InternosService } from '../../services/internos.service';
import { closeLoadingRequets, showLoadingRequest } from 'src/app/helpers/loading.helper';
import { TypesProceduresGrouped } from 'src/app/administration/models/tipoTramite.interface';
@Component({
  selector: 'app-dialog-internos',
  templateUrl: './dialog-internos.component.html',
  styleUrls: ['./dialog-internos.component.scss']
})
export class DialogInternosComponent implements OnInit {
  filteredOptions: Observable<any[]>;
  filteredDestiny: Observable<any[]>;

  TramiteFormGroup: FormGroup = this.fb.group({
    tipo_tramite: ['', Validators.required],
    detalle: ['', Validators.required],
    cite: [this.authService.code],
    nombre_remitente: [this.authService.account.officer.fullname, Validators.required],
    cargo_remitente: [this.authService.account.officer.jobtitle, Validators.required],
    nombre_destinatario: ['', Validators.required],
    cargo_destinatario: ['', Validators.required],
    cantidad: ['', Validators.required],
  });

  tipos_tramites: TypesProceduresGrouped[] = []


  constructor(
    private authService: AuthService,
    private internoService: InternosService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogInternosComponent>,) {
  }

  ngOnInit(): void {
    if (this.data) {
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
      this.internoService.getTypes().subscribe(tipos => {
        this.tipos_tramites = tipos
        this.TramiteFormGroup.get('tipo_tramite')?.setValue(tipos[0].id_tipoTramite)
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

  guardar() {
    const {
      nombre_remitente,
      cargo_remitente,
      nombre_destinatario,
      cargo_destinatario,
      ...Object } = this.TramiteFormGroup.value
    const tramite = {
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
    showLoadingRequest()
    const observable = this.data
      ? this.internoService.Edit(this.data._id, tramite)
      : this.internoService.Add(tramite)
    observable.subscribe(tramite => {
      closeLoadingRequets(this.data ? 'Tramite editado' : 'Tramite guardado')
      this.dialogRef.close(tramite)
    })
  }

  FiltrarUsuarios(termino: string) {
    return this.internoService.getUsers(termino)
      .pipe(
        map(officers => officers)
      )
  }
  FiltrarDestinatarios(termino: string) {
    return this.internoService.getUsers(termino)
      .pipe(
        map(officers => officers)
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

