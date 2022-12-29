import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TiposTramitesModel } from 'src/app/Configuraciones/models/tiposTramites.model';
import { TramiteService } from '../../services/tramite.service';
import { ExternoModel } from '../../models/externo.model'
import { RepresentanteModel } from '../../models/solicitud.model'
import { ExternosService } from '../../services/externos.service';
@Component({
  selector: 'app-dialog-externo',
  templateUrl: './dialog-externo.component.html',
  styleUrls: ['./dialog-externo.component.css']
})
export class DialogExternoComponent implements OnInit {
  Segmentos: string[] = []
  Tipos_Tramites: TiposTramitesModel[] = []
  Tipos_Tramites_Segmentados: TiposTramitesModel[] = []
  Tipo_Tramite_Seleccionado: TiposTramitesModel | null
  tipos_documento: string[] = [
    'Carnet de identidad',
    'Libreta servicio militar',
    'Pasaporte'
  ]
  Lugares = [
    'Cochabamba',
    'Santa Cruz',
    'La paz',
    'Beni',
    'Pando',
    'Oruro',
    'Potosi',
    'Tarija',
    'Chuquisaca',
  ]
  TramiteFormGroup: FormGroup = this.fb.group({
    cantidad: ['', Validators.required],
    detalle: ['', Validators.required],
    tipo_tramite: ['', Validators.required],
    alterno: [''],
    requerimientos: [''],
    ubicacion: [this.authService.Detalles_Cuenta.id_cuenta],
    cite: [this.authService.Detalles_Cuenta.codigo]
  });
  SolicitanteFormGroup: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    telefono: ['', Validators.required],
    tipo: ['', Validators.required],
    dni: ['', Validators.required],
    expedido: ['', Validators.required],
    documento: ['', Validators.required],
  });
  RepresentanteFormGroup: FormGroup | null = null;

  constructor(
    private externoService: ExternosService,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogExternoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {

    if (this.data) {
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
      this.externoService.getTiposTramite().subscribe(data => {
        this.Segmentos = data.segmentos
        this.Tipos_Tramites = data.tiposTramites
      })
    }
  }
  segmentar_tramites(segmento: string) {
    this.Tipo_Tramite_Seleccionado = null
    this.Tipos_Tramites_Segmentados = this.Tipos_Tramites.filter(tipo => tipo.segmento === segmento)
  }
  seleccionar_tipo_tramite(tipo: TiposTramitesModel) {
    this.Tipo_Tramite_Seleccionado = tipo
    this.TramiteFormGroup.get('tipo_tramite')?.setValue(tipo.id_tipoTramite)
    this.TramiteFormGroup.get('alterno')?.setValue(`${tipo.segmento}-${this.authService.Detalles_Cuenta.institucion}`)
    this.TramiteFormGroup.get('requerimientos')?.setValue(
      tipo.requerimientos.map(element => {
        return element.nombre
      })
    )
  }


  guardar() {
    if (this.data) {
      this.externoService.editExterno(this.data._id, this.TramiteFormGroup.value, this.SolicitanteFormGroup.value, this.RepresentanteFormGroup?.value).subscribe(tramite => {
        this.dialogRef.close(tramite)
      })
    }
    else {
      this.externoService.addExterno(this.TramiteFormGroup.value, this.SolicitanteFormGroup.value, this.RepresentanteFormGroup?.value).subscribe(tramite => {
        this.dialogRef.close(tramite)
      })
    }
  }

  changeFormSolicitante(type: 'NATURAL' | 'JURIDICO') {
    switch (type) {
      case 'NATURAL':
        this.SolicitanteFormGroup = this.fb.group({
          nombre: ['', Validators.required],
          paterno: ['', Validators.required],
          materno: [''],
          telefono: ['', Validators.required],
          tipo: [type, Validators.required],
          dni: ['', Validators.required],
          expedido: ['', Validators.required],
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
          expedido: ['', Validators.required],
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
