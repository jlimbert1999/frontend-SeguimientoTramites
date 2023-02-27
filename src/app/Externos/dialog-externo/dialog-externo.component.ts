import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Externo, Representante, Solicitante, TypeTramiteData } from '../models/Externo.interface';
import { ExternosService } from '../services/externos.service';
@Component({
  selector: 'app-dialog-externo',
  templateUrl: './dialog-externo.component.html',
  styleUrls: ['./dialog-externo.component.css']
})
export class DialogExternoComponent implements OnInit {
  Segmentos: string[] = []
  Types: TypeTramiteData[] = []
  SelectedType: TypeTramiteData | null
  tipos_documento: string[] = [
    'Carnet de identidad',
    'Libreta servicio militar',
    'Pasaporte'
  ]
  TramiteFormGroup: FormGroup = this.fb.group({
    cantidad: ['', Validators.required],
    detalle: ['', Validators.required],
    tipo_tramite: ['', Validators.required],
    alterno: [''],
    requerimientos: [''],
    cite: ['']
  });
  SolicitanteFormGroup: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    telefono: [''],
    tipo: ['', Validators.required],
    dni: ['', Validators.required],
    documento: ['', Validators.required],
  });
  RepresentanteFormGroup: FormGroup | null = null;
  title: string

  constructor(
    private externoService: ExternosService,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogExternoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Externo,

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.title = 'EDICION TRAMITE'
      this.TramiteFormGroup = this.fb.group({
        cantidad: ['', Validators.required],
        detalle: ['', Validators.required],
        cite: ['']
      });
      this.TramiteFormGroup.patchValue(this.data)
      this.changeFormSolicitante(this.data.solicitante.tipo)
      this.SolicitanteFormGroup.patchValue(this.data.solicitante)
      if (this.data.representante) {
        this.changeFormRepresentante(true)
        this.RepresentanteFormGroup?.patchValue(this.data.representante)
      }
      else {
        this.changeFormRepresentante(false)
      }
    }
    else {
      this.title = 'REGISTRO TRAMITE'
      this.externoService.getGroups().subscribe(segmentos => {
        this.Segmentos = segmentos
      })
    }
  }
  getTypes(segmento: string) {
    this.SelectedType = null
    this.externoService.getTypes(segmento).subscribe(types => {
      this.Types = types
      this.TramiteFormGroup.get('alterno')?.setValue(`${segmento}-${this.authService.Account.codigo}`)
    })
  }
  selectType(type: TypeTramiteData) {
    this.SelectedType = type
    this.TramiteFormGroup.get('tipo_tramite')?.setValue(type.id_tipoTramite)
    this.TramiteFormGroup.get('requerimientos')?.setValue(this.SelectedType?.requerimientos.map(requerimiento => requerimiento.nombre))
  }


  guardar() {
    if (this.data) {
      let Tramite: { tramite: any, solicitante: any, representante: any | null }
      switch (this.RepresentanteFormGroup) {
        case null:
          Tramite = {
            tramite: this.TramiteFormGroup.value,
            solicitante: this.SolicitanteFormGroup.value,
            representante: null
          }
          break;
        default:
          Tramite = {
            tramite: this.TramiteFormGroup.value,
            solicitante: this.SolicitanteFormGroup.value,
            representante: this.RepresentanteFormGroup.value
          }
          break;
      }
      this.dialogRef.close(Tramite)
    }
    else {
      let Tramite: { tramite: Externo, solicitante: Solicitante, representante: Representante | null }
      switch (this.RepresentanteFormGroup) {
        case null:
          Tramite = {
            tramite: this.TramiteFormGroup.value,
            solicitante: this.SolicitanteFormGroup.value,
            representante: null
          }
          break;
        default:
          Tramite = {
            tramite: this.TramiteFormGroup.value,
            solicitante: this.SolicitanteFormGroup.value,
            representante: this.RepresentanteFormGroup.value
          }
          break;
      }
      this.dialogRef.close(Tramite)
    }
  }

  changeFormSolicitante(type: 'NATURAL' | 'JURIDICO') {
    switch (type) {
      case 'NATURAL':
        this.SolicitanteFormGroup = this.fb.group({
          nombre: ['', Validators.required],
          paterno: ['', Validators.required],
          materno: [''],
          telefono: [''],
          tipo: [type, Validators.required],
          dni: ['', Validators.required],
          documento: ['', Validators.required],
        });
        break;
      case 'JURIDICO':
        this.SolicitanteFormGroup = this.fb.group({
          nombre: ['', Validators.required],
          telefono: [''],
          tipo: [type, Validators.required],
        });
        break;
    }
  }
  changeFormRepresentante(register: boolean) {
    switch (register) {
      case true:
        this.RepresentanteFormGroup = this.fb.group({
          nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
          paterno: ['', Validators.required],
          materno: [''],
          documento: ['', Validators.required],
          dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
          telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
        });
        break;
      case false:
        this.RepresentanteFormGroup = null
        break;

    }
  }

  ValidForms() {
    let disabled: boolean = true
    switch (this.RepresentanteFormGroup) {
      case null:
        if (this.TramiteFormGroup.valid && this.SolicitanteFormGroup.valid) {
          disabled = false
        }
        break;
      default:
        if (this.TramiteFormGroup.valid && this.SolicitanteFormGroup.valid && this.RepresentanteFormGroup.valid) {
          disabled = false
        }
        break;
    }
    return disabled
  }
}
