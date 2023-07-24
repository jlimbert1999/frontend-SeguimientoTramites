import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Externo, Representante, Solicitante } from '../../models/Externo.interface';
import { ExternosService } from '../../services/externos.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { closeLoadingRequets, showLoadingRequest } from 'src/app/helpers/loading.helper';
import { TipoTramite } from 'src/app/administration/models/tipoTramite.interface';
import { typeProcedure } from 'src/app/administration/interfaces/typeProcedure.interface';


@Component({
  selector: 'app-dialog-externo',
  templateUrl: './dialog-externo.component.html',
  styleUrls: ['./dialog-externo.component.scss']
})
export class DialogExternoComponent implements OnInit {
  segments: string[] = []
  typesProcedures: typeProcedure[] = []
  SelectedType: TipoTramite | null
  tipos_documento: string[] = [
    'Carnet de identidad',
    'Libreta servicio militar',
    'Pasaporte'
  ]
  TramiteFormGroup: FormGroup = this.fb.group({
    cantidad: ['', Validators.required],
    detalle: ['', Validators.required],
    tipo_tramite: ['', Validators.required],
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


  constructor(
    private externoService: ExternosService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogExternoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Externo,
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
      this.externoService.getSegments().subscribe(data => {
        this.segments = data
      })
    }
  }
  getTypesProceduresBySegment(segment: string) {
    this.externoService.getTypesProceduresBySegment(segment).subscribe(data => {
      this.typesProcedures = data
    })
  }


  selectTypeProcedure(type: TipoTramite) {
    this.SelectedType = type
    this.TramiteFormGroup.get('tipo_tramite')?.setValue(type.id_tipoTramite)
    this.TramiteFormGroup.get('requerimientos')?.setValue(this.SelectedType?.requerimientos.map(requerimiento => requerimiento.nombre))
  }


  guardar() {
    showLoadingRequest()
    if (this.data) {
      let obeservable: Observable<Externo> = this.RepresentanteFormGroup
        ? this.externoService.Edit(this.data._id, this.TramiteFormGroup.value, this.SolicitanteFormGroup.value, this.RepresentanteFormGroup.value)
        : this.externoService.Edit(this.data._id, this.TramiteFormGroup.value, this.SolicitanteFormGroup.value, null)
      obeservable.subscribe(externo => {
        closeLoadingRequets('Tramite editado')
        this.dialogRef.close(externo)
      })
    }
    else {
      let obeservable: Observable<Externo> = this.RepresentanteFormGroup
        ? this.externoService.Add(this.TramiteFormGroup.value, this.SolicitanteFormGroup.value, this.RepresentanteFormGroup.value)
        : this.externoService.Add(this.TramiteFormGroup.value, this.SolicitanteFormGroup.value, null)
      obeservable.subscribe(externo => {
        closeLoadingRequets('Tramite guardado')
        this.dialogRef.close(externo)
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
    register
      ? this.RepresentanteFormGroup = this.fb.group({
        nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
        paterno: ['', Validators.required],
        materno: [''],
        documento: ['', Validators.required],
        dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
      })
      : this.RepresentanteFormGroup = null
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
