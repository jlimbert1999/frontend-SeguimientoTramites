import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InternoData, TipoTramiteInternoModel, TramiteInternoModel } from '../../models/interno.model';
import { BandejaService } from '../../services/bandeja.service';
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
    cite: [''],
    nombre_remitente: [this.authService.Account.funcionario.nombre_completo, Validators.required],
    cargo_remitente: [this.authService.Account.funcionario.cargo, Validators.required],
    nombre_destinatario: ['', Validators.required],
    cargo_destinatario: ['', Validators.required],
    cantidad: ['', Validators.required],
    alterno: ['']
  });

  tipos_tramites: TipoTramiteInternoModel[] = []


  constructor(
    private authService: AuthService,
    private bandejaService: BandejaService,
    private internoService: InternosService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: InternoData,
    public dialogRef: MatDialogRef<DialogInternosComponent>,) {
  }

  ngOnInit(): void {
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
    if (this.data) {
      this.TramiteFormGroup = this.fb.group({
        detalle: [this.data.detalle, Validators.required],
        cite: [this.data.cite, Validators.required],
        nombre_remitente: [this.data.remitente.nombre, Validators.required],
        cargo_remitente: [this.data.remitente.cargo, Validators.required],
        nombre_destinatario: [this.data.destinatario.nombre, Validators.required],
        cargo_destinatario: [this.data.destinatario.cargo, Validators.required],
        cantidad: [this.data.cantidad, Validators.required]
      });
    }
    else {
      this.internoService.getTiposTramite().subscribe(tipos => {
        this.tipos_tramites = tipos
      })
    }
  }

  generar_alterno(segmento: string) {
    this.TramiteFormGroup.get('alterno')?.setValue(`${segmento}-${this.authService.Account.codigo}`)
  }
  guardar() {
    const {
      nombre_remitente,
      cargo_remitente,
      nombre_destinatario,
      cargo_destinatario,
      ...Object } = this.TramiteFormGroup.value
    let tramite: TramiteInternoModel = {
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
    // if (this.data) {
    //   this.internoService.editInterno(this.data._id, tramite).subscribe(tramite => {
    //     this.dialogRef.close(tramite)
    //   })
    // }
    // else {
    //   this.internoService.addInterno(tramite).subscribe(tramite => {
    //     this.dialogRef.close(tramite)
    //   })

    // }

  }


  FiltrarUsuarios(termino: string) {
    return this.internoService.getUsuarios(termino)
      .pipe(
        map(response => response.usuarios.filter(options => {
          return options
        }))
      )
  }
  FiltrarDestinatarios(termino: string) {
    return this.internoService.getUsuarios(termino)
      .pipe(
        map(response => response.usuarios.filter(options => {
          return options
        }))
      )
  }
  seleccionar_remitente(funcionario: any) {
    this.TramiteFormGroup.get('cargo_remitente')?.setValue(funcionario.cargo)
    this.TramiteFormGroup.get('nombre_remitente')?.setValue(`${funcionario.nombre} ${funcionario.paterno} ${funcionario.materno}`)
  }
  seleccionar_destinatario(funcionario: any) {
    this.TramiteFormGroup.get('cargo_destinatario')?.setValue(funcionario.cargo)
    this.TramiteFormGroup.get('nombre_destinatario')?.setValue(`${funcionario.nombre} ${funcionario.paterno} ${funcionario.materno}`)
  }

}
