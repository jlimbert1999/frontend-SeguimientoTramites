import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Externo, Representante, Solicitante } from '../../models/Externo.interface';
import { ExternosService } from '../../services/externos.service';
import { TipoTramite } from 'src/app/Configuraciones/models/tipoTramite.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dialog-externo',
  templateUrl: './dialog-externo.component.html',
  styleUrls: ['./dialog-externo.component.scss']
})
export class DialogExternoComponent implements OnInit {
  Segmentos: string[] = []
  TypesProcedures: TipoTramite[] = []
  TypesProceduresSegmented: TipoTramite[] = []
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
    private authService: AuthService
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
      this.externoService.getTypesProcedures().subscribe(data => {
        this.Segmentos = data.segments
        this.TypesProcedures = data.types
      })
    }
  }
  segmentProcedures(segment: string) {
    this.TypesProceduresSegmented = []
    this.TypesProceduresSegmented = this.TypesProcedures.filter(type => type.segmento === segment)
  }


  selectTypeProcedure(type: TipoTramite) {
    this.SelectedType = type
    this.TramiteFormGroup.get('tipo_tramite')?.setValue(type.id_tipoTramite)
    this.TramiteFormGroup.get('requerimientos')?.setValue(this.SelectedType?.requerimientos.map(requerimiento => requerimiento.nombre))
    // this.TramiteFormGroup.get('alterno')?.setValue(`${type.segmento}-${this.authService.account.institutionCode}`)
  }




  guardar() {
    this.showLoadingRequest()
    if (this.data) {
      let obeservable: Observable<Externo> = this.RepresentanteFormGroup
        ? this.externoService.Edit(this.data._id, this.TramiteFormGroup.value, this.SolicitanteFormGroup.value, this.RepresentanteFormGroup.value)
        : this.externoService.Edit(this.data._id, this.TramiteFormGroup.value, this.SolicitanteFormGroup.value, null)
      obeservable.subscribe(externo => {
        Swal.close();
        this.dialogRef.close(externo)
      })
    }
    else {
      let obeservable: Observable<Externo> = this.RepresentanteFormGroup
        ? this.externoService.Add(this.TramiteFormGroup.value, this.SolicitanteFormGroup.value, this.RepresentanteFormGroup.value)
        : this.externoService.Add(this.TramiteFormGroup.value, this.SolicitanteFormGroup.value, null)
      obeservable.subscribe(externo => {
        Swal.close();
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

  showLoadingRequest() {
    Swal.fire({
      title: 'Guardando....',
      text: 'Por favor espere',
      allowOutsideClick: false,
    });
    Swal.showLoading()
  }
}
