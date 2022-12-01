import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TiposTramitesModel } from 'src/app/Configuraciones/models/tiposTramites.model';
import { TramiteService } from '../../services/tramite.service';
import { ExternoModel } from '../../models/tramite_externo.model'
import { RepresentanteModel } from '../../models/solicitud.model'
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
  tipo_solicitante: string
  tipos_documento: string[] = [
    'Libreta servicio militar',
    'Carnet de identidad'
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
  registrar_representante: boolean = false
  TramiteFormGroup: FormGroup = this.fb.group({
    cantidad: ['', Validators.required],
    detalle: ['', Validators.required],
    tipo_tramite: ['', Validators.required],
    alterno: [''],
    requerimientos: [''],
    ubicacion: [this.authService.Detalles_Cuenta.id_cuenta]
  });
  SolicitanteFormGroup: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    tipo: ['', Validators.required],
    dni: ['', Validators.required],
    expedido: ['', Validators.required],
    documento: ['', Validators.required],
  });
  RepresentanteFormGroup: FormGroup | null;

  constructor(
    private tramiteService: TramiteService,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogExternoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.TramiteFormGroup = this.fb.group({
        cantidad: ['', Validators.required],
        detalle: ['', Validators.required]
      });
      this.tipo_solicitante = this.data.solicitante.tipo
      switch (this.data.solicitante.tipo) {
        case 'NATURAL':
          this.SolicitanteFormGroup = this.fb.group({
            nombre: ['', Validators.required],
            telefono: ['', Validators.required],
            tipo: ['', Validators.required],
            dni: ['', Validators.required],
            expedido: ['', Validators.required],
            documento: ['', Validators.required],
          });
          break;
        case 'JURIDICO':
          this.SolicitanteFormGroup = this.fb.group({
            nombre: ['', Validators.required],
            telefono: ['', Validators.required],
            tipo: [, Validators.required],
          });
          break;
      }
      if (this.data.representante) {
        this.registrar_representante = true
        this.RepresentanteFormGroup = this.fb.group({
          nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
          documento: ['', Validators.required],
          dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
          expedido: ['', Validators.required],
          telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
        });
        this.RepresentanteFormGroup.patchValue(this.data.representante)
      }
      else {
        this.registrar_representante = false
      }
      this.SolicitanteFormGroup.patchValue(this.data.solicitante)
      this.TramiteFormGroup.patchValue(this.data)

    }
    else {
      this.tramiteService.obtener_tipos_tramites('EXTERNO').subscribe(data => {
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
  seleccionar_tipo_solicitante(tipo: 'NATURAL' | 'JURIDICO') {
    this.tipo_solicitante = tipo
    if (tipo === 'JURIDICO') {
      this.SolicitanteFormGroup = this.fb.group({
        nombre: ['', Validators.required],
        telefono: [''],
        tipo: [tipo, Validators.required],
      });
    }
    else {
      this.SolicitanteFormGroup = this.fb.group({
        nombre: ['', Validators.required],
        telefono: [''],
        tipo: [tipo, Validators.required],
        dni: ['', Validators.required],
        expedido: ['', Validators.required],
        documento: ['', Validators.required],
      });
    }

  }
  seleccionar_registro_representante(registrar: boolean) {
    this.registrar_representante = registrar
    if (registrar) {
      this.RepresentanteFormGroup = this.fb.group({
        nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
        documento: ['', Validators.required],
        dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        expedido: ['', Validators.required],
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
      });
    }
    else {
      this.RepresentanteFormGroup = null
    }
  }
  guardar() {
    if (this.data) {
      let editSolicitiante = { _id: this.data.solicitante._id, ...this.SolicitanteFormGroup.value }
      let editRepresentante
      if (this.data.representante) {
        editRepresentante = { _id: this.data.representante._id, ...this.RepresentanteFormGroup?.value }
      }
      else {
        editRepresentante = this.RepresentanteFormGroup?.value
      }
      this.tramiteService.editar_tramite_externo(this.data._id, this.TramiteFormGroup.value, editSolicitiante, editRepresentante).subscribe(tramite => {
        this.dialogRef.close(tramite)
      })
    }
    else {
      let representante: RepresentanteModel | null
      if (this.registrar_representante) {
        representante = this.RepresentanteFormGroup?.value
      }
      else {
        representante = null
      }
      this.tramiteService.agregar_tramite_externo(this.TramiteFormGroup.value, this.SolicitanteFormGroup.value, representante!).subscribe(tramite => {
        this.dialogRef.close(tramite)
      })
    }
  }


}
