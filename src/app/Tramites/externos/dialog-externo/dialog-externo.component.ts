import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TiposTramitesModel } from 'src/app/Configuraciones/models/tiposTramites.model';
import { TramiteService } from '../../services/tramite.service';
import { ExternoModel } from '../../models/externo.model'
import { RepresentanteModel } from '../../models/solicitud.model'
import { ExternosService } from '../../services/externos.service';
import { TipoTramite_Registro } from '../models/tipos';
import { Externo, ExternoData, Representante, Solicitante } from '../models/externo';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dialog-externo',
  templateUrl: './dialog-externo.component.html',
  styleUrls: ['./dialog-externo.component.css']
})
export class DialogExternoComponent implements OnInit {
  Segmentos: string[] = []
  Types: TipoTramite_Registro[] = []
  SelectedType: TipoTramite_Registro | null
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
    cite: [this.authService.Detalles_Cuenta.codigo]
  });
  SolicitanteFormGroup: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    telefono: [''],
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
    @Inject(MAT_DIALOG_DATA) public data: ExternoData,

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
      this.externoService.getGroups().subscribe(segmentos => {
        this.Segmentos = segmentos
      })
    }
  }
  getTypes(segmento: string) {
    this.SelectedType = null
    this.externoService.getTypes(segmento).subscribe(types => {
      this.Types = types
      this.TramiteFormGroup.get('alterno')?.setValue(`${segmento}-${this.authService.Detalles_Cuenta.institucion}`)
    })
  }
  selectType(type: TipoTramite_Registro) {
    this.SelectedType = type
    this.TramiteFormGroup.get('tipo_tramite')?.setValue(type.id_tipoTramite)
  }


  guardar() {
    if (this.data) {
      let Tramite: { tramite: any, solicitante: Solicitante, representante: Representante | null }
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
      this.TramiteFormGroup.get('requerimientos')?.setValue(this.SelectedType?.requerimientos.map(requerimiento => requerimiento.nombre))
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
