import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NestedPartial } from 'src/app/shared/interfaces/nested-partial';
import { typeProcedure } from 'src/app/administration/interfaces';
import { ExternalService } from '../../services/external.service';
import { ExternalProcedureDto } from '../../dtos';
import { external } from '../../interfaces';

@Component({
  selector: 'app-external-dialog',
  templateUrl: './external-dialog.component.html',
  styleUrls: ['./external-dialog.component.scss'],
})
export class ExternalDialogComponent implements OnInit {
  segments: string[] = [];
  typesProcedures: typeProcedure[] = [];
  typeAplicant: 'NATURAL' | 'JURIDICO' = 'NATURAL';
  requeriments: string[] = [];
  tipos_documento: string[] = ['Carnet de identidad', 'Libreta servicio militar', 'Pasaporte'];
  TramiteFormGroup: FormGroup;
  SolicitanteFormGroup: FormGroup;
  RepresentanteFormGroup: FormGroup;
  segment: string;

  constructor(
    private externoService: ExternalService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExternalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: external
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.TramiteFormGroup = this.createFormProcedure('EDIT');
      this.SolicitanteFormGroup = this.changeFormSolicitante(this.data.details.solicitante.tipo);
      this.SolicitanteFormGroup.patchValue(this.data.details.solicitante);
      if (this.data.details.representante) {
        this.changeFormRepresentante(true);
        this.RepresentanteFormGroup.patchValue(this.data.details.representante);
      } else {
        this.changeFormRepresentante(false);
      }
    } else {
      this.TramiteFormGroup = this.createFormProcedure('ADD');
      this.changeFormSolicitante('NATURAL');
      this.changeFormRepresentante(false);
      this.externoService.getSegments().subscribe((data) => {
        this.segments = data;
      });
    }
  }
  getTypesProceduresBySegment(segment: string) {
    this.requeriments = [];
    this.TramiteFormGroup.get('type')?.setValue('');
    this.externoService.getTypesProceduresBySegment(segment).subscribe((data) => {
      this.typesProcedures = data;
    });
  }

  selectTypeProcedure(type: typeProcedure) {
    this.TramiteFormGroup.get('type')?.setValue(type._id);
    this.segment = type.segmento;
    this.requeriments = type.requerimientos.filter((el) => el.activo).map((el) => el.nombre);
  }

  save() {
    if (this.data) {
      const updateProcedure: NestedPartial<ExternalProcedureDto> = {
        procedure: this.TramiteFormGroup.value,
        details: {
          solicitante: this.SolicitanteFormGroup.value,
          ...(this.data.details.representante && { representante: this.RepresentanteFormGroup.value }),
        },
      };
      this.externoService.Edit(this.data._id, updateProcedure).subscribe((procedure) => {
        this.dialogRef.close(procedure);
      });
    } else {
      const procedure = ExternalProcedureDto.fromForms({
        segment: this.segment,
        requeriments: this.requeriments,
        formProcedure: this.TramiteFormGroup.value,
        formApplicant: this.SolicitanteFormGroup.value,
        formRepresentative: this.RepresentanteFormGroup.value,
      });
      this.externoService.Add(procedure).subscribe((procedure) => {
        this.dialogRef.close(procedure);
      });
    }
  }

  changeFormSolicitante(type: 'NATURAL' | 'JURIDICO') {
    this.typeAplicant = type;
    switch (type) {
      case 'NATURAL':
        return this.fb.group({
          nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
          paterno: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
          materno: ['', Validators.pattern('^[a-zA-Z ]*$')],
          telefono: [
            '',
            [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
          ],
          dni: [
            '',
            [Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
          ],
          documento: ['', Validators.required],
          tipo: ['NATURAL'],
        });
        break;
      case 'JURIDICO':
        return (this.SolicitanteFormGroup = this.fb.group({
          nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ,.]*$')]],
          telefono: [
            '',
            [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
          ],
          tipo: ['JURIDICO'],
        }));
        break;
    }
  }
  changeFormRepresentante(register: boolean) {
    this.RepresentanteFormGroup = register
      ? this.fb.group({
          nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
          paterno: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
          materno: ['', Validators.pattern('^[a-zA-Z ]*$')],
          documento: ['', Validators.required],
          dni: [
            '',
            [Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
          ],
          telefono: [
            '',
            [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
          ],
        })
      : this.fb.group({});
  }

  get registerRepresentative(): boolean {
    return Object.keys(this.RepresentanteFormGroup.value).length > 0 ? true : false;
  }

  get validForms(): boolean {
    return !(this.TramiteFormGroup.valid && this.SolicitanteFormGroup.valid && this.RepresentanteFormGroup.valid);
  }

  getErrorMessageFormAplicant(controlName: string) {
    const control = this.SolicitanteFormGroup.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    } else if (control?.hasError('pattern')) {
      const patternError = control.getError('pattern');
      switch (patternError?.requiredPattern) {
        case '^[a-zA-Z ]*$':
          return 'Solo letras';
        case '^[0-9]*$':
          return 'Solo numeros';
        case '^[a-zA-Z0-9]*$':
          return 'Solo letras y numeros';
        default:
          break;
      }
    } else if (control?.hasError('minlength')) {
      const minLengthRequired = control.getError('minlength').requiredLength;
      return `Ingrese al menos ${minLengthRequired} caracteres`;
    } else if (control?.hasError('maxlength')) {
      const maxLengthRequired = control.getError('maxlength').requiredLength;
      return `Solo ${maxLengthRequired} caracteres`;
    }
    return '';
  }

  createFormProcedure(mode: 'ADD' | 'EDIT') {
    return mode === 'ADD'
      ? this.fb.group({
          amount: ['', Validators.required],
          reference: ['', Validators.required],
          type: ['', Validators.required],
          cite: [''],
        })
      : this.fb.group({
          amount: [this.data.amount, Validators.required],
          reference: [this.data.reference, Validators.required],
          cite: [this.data.cite],
        });
  }
}
