import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Externo, Representante, Solicitante } from '../../models/Externo.interface';
import { ExternosService } from '../../services/externos.service';
import { Observable } from 'rxjs';
import { closeLoadingRequets } from 'src/app/helpers/loading.helper';
import { typeProcedure } from 'src/app/administration/interfaces/typeProcedure.interface';
import { ExternalProcedureDto } from '../../dtos/external.dto';
import { external } from '../../interfaces/external.interface';

@Component({
  selector: 'app-dialog-externo',
  templateUrl: './dialog-externo.component.html',
  styleUrls: ['./dialog-externo.component.scss']
})
export class DialogExternoComponent implements OnInit {
  segments: string[] = []
  typesProcedures: typeProcedure[] = []
  typeAplicant: 'NATURAL' | 'JURIDICO' = 'NATURAL'
  requeriments: string[] = []
  tipos_documento: string[] = [
    'Carnet de identidad',
    'Libreta servicio militar',
    'Pasaporte'
  ]
  TramiteFormGroup: FormGroup = this.fb.group({
    cantidad: ['', Validators.required],
    detalle: ['', Validators.required],
    tipo_tramite: ['', Validators.required],
    cite: ['']
  });
  SolicitanteFormGroup: FormGroup
  RepresentanteFormGroup: FormGroup;


  constructor(
    private externoService: ExternosService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogExternoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: external,
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
      this.requeriments = this.data.requerimientos
      if (this.data.representante) {
        this.changeFormRepresentante(true)
        this.RepresentanteFormGroup?.patchValue(this.data.representante)
      }
      else {
        this.changeFormRepresentante(false)
      }
    }
    else {
      this.changeFormSolicitante('NATURAL')
      this.changeFormRepresentante(false)
      this.externoService.getSegments().subscribe(data => {
        this.segments = data
      })
    }
  }
  getTypesProceduresBySegment(segment: string) {
    this.requeriments = []
    this.TramiteFormGroup.get('tipo_tramite')?.setValue('')
    this.externoService.getTypesProceduresBySegment(segment).subscribe(data => {
      this.typesProcedures = data
    })
  }


  selectTypeProcedure(type: typeProcedure) {
    this.TramiteFormGroup.get('tipo_tramite')?.setValue(type._id)
    this.requeriments = type.requerimientos.filter(el => el.activo).map(el => el.nombre)
  }


  guardar() {
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
      const procedure = ExternalProcedureDto.fromForm(this.TramiteFormGroup.value, this.requeriments, this.SolicitanteFormGroup.value, this.RepresentanteFormGroup.value)
      this.externoService.Add(procedure).subscribe(procedure => {
        this.dialogRef.close(procedure)
      })
    }
  }

  changeFormSolicitante(type: 'NATURAL' | 'JURIDICO') {
    this.typeAplicant = type
    switch (type) {
      case 'NATURAL':
        this.SolicitanteFormGroup = this.fb.group({
          nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
          paterno: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
          materno: ['', Validators.pattern('^[a-zA-Z ]*$')],
          telefono: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
          dni: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
          documento: ['', Validators.required],
          tipo: ['NATURAL'],
        });
        break;
      case 'JURIDICO':
        this.SolicitanteFormGroup = this.fb.group({
          nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
          telefono: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
          tipo: ['JURIDICO'],
        });
        break;
    }
  }
  changeFormRepresentante(register: boolean) {
    register
      ? this.RepresentanteFormGroup = this.fb.group({
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        paterno: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        materno: ['', Validators.pattern('^[a-zA-Z ]*$')],
        documento: ['', Validators.required],
        dni: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
        telefono: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]]
      })
      : this.RepresentanteFormGroup = this.fb.group({});
  }

  get registerRepresentative(): boolean {
    return Object.keys(this.RepresentanteFormGroup.value).length > 0 ? true : false
  }

  get validForms(): boolean {
    const isTramiteValid = this.TramiteFormGroup.valid;
    const isSolicitanteValid = this.SolicitanteFormGroup.valid;
    const isRepresentanteValid = this.RepresentanteFormGroup.valid
    const disabled = !(isTramiteValid && isSolicitanteValid && isRepresentanteValid);
    return disabled;
  }

  getErrorMessageFormAplicant(controlName: string) {
    const control = this.SolicitanteFormGroup.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    else if (control?.hasError('pattern')) {
      const patternError = control.getError('pattern');
      switch (patternError?.requiredPattern) {
        case '^[a-zA-Z ]*$':
          return 'Solo letras';
        case '^[0-9]*$':
          return 'Solo numeros';
        default:
          break;
      }
    }
    else if (control?.hasError('minlength')) {
      const minLengthRequired = control.getError('minlength').requiredLength;
      return `Ingrese al menos ${minLengthRequired} caracteres`;
    }
    else if (control?.hasError('maxlength')) {
      const maxLengthRequired = control.getError('maxlength').requiredLength;
      return `Solo ${maxLengthRequired} caracteres`;
    }
    return '';
  }
}
