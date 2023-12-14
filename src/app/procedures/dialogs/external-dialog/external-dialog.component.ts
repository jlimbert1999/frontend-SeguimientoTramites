import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectSearchData, NestedPartial } from 'src/app/shared/interfaces';
import { typeProcedure } from 'src/app/administration/interfaces';
import { ExternalService } from '../../services/external.service';
import { external, typeApplicant } from '../../interfaces';
import { ExternalProcedureDto } from '../../dtos';

@Component({
  selector: 'app-external-dialog',
  templateUrl: './external-dialog.component.html',
  styleUrls: ['./external-dialog.component.scss'],
})
export class ExternalDialogComponent implements OnInit {
  segments = signal<MatSelectSearchData<string>[]>([]);
  typesProcedures = signal<MatSelectSearchData<typeProcedure>[]>([]);
  requirements: string[] = [];

  documents: string[] = ['Carnet de identidad', 'Libreta servicio militar', 'Pasaporte'];
  selectedtypeApplicant: typeApplicant = 'NATURAL';
  registerRepresentative: boolean = false;

  TramiteFormGroup: FormGroup = this.fb.group({
    segment: ['', Validators.required],
    amount: ['', Validators.required],
    reference: ['', Validators.required],
    type: ['', Validators.required],
    cite: [''],
  });
  SolicitanteFormGroup: FormGroup;
  RepresentanteFormGroup: FormGroup;

  ProcedureForm: FormGroup = this.fb.group({
    segment: ['', Validators.required],
    amount: ['', Validators.required],
    reference: ['', Validators.required],
    type: ['', Validators.required],
    cite: [''],
    applicant: this.fb.group({
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
      tipo: [this.selectedtypeApplicant],
    }),
    representative: {},
  });

  constructor(
    private fb: FormBuilder,
    private externoService: ExternalService,
    public dialogRef: MatDialogRef<ExternalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: external
  ) {}

  ngOnInit(): void {
    if (this.data) {
      const { details, ...values } = this.data;
      this.TramiteFormGroup.removeControl('segment');
      this.TramiteFormGroup.removeControl('type');
      this.TramiteFormGroup.patchValue(values);
      this.registerRepresentative = details.representante ? true : false;
      this.selectedtypeApplicant = details.solicitante.tipo;
    } else {
      this.externoService.getSegments().subscribe((data) => {
        this.segments.set(data.map((segment) => ({ text: segment, value: segment })));
      });
    }
    this.createFormApplicant();
    this.createFormRepresentative();
    this.SolicitanteFormGroup.patchValue(this.data?.details.solicitante || {});
    this.RepresentanteFormGroup.patchValue(this.data?.details.representante || {});
  }

  getTypesProceduresBySegment(segment: string) {
    this.TramiteFormGroup.get('segment')?.setValue(segment);
    this.TramiteFormGroup.get('type')?.setValue('');
    this.requirements = [];
    this.externoService.getTypesProceduresBySegment(segment).subscribe((data) => {
      this.typesProcedures.set(data.map((type) => ({ value: type, text: type.nombre })));
    });
  }
  selectTypeProcedure(type: typeProcedure) {
    this.TramiteFormGroup.get('type')?.setValue(type._id);
    this.requirements = type.requerimientos.filter((requirement) => requirement.nombre).map((type) => type.nombre);
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
      console.log(updateProcedure);
      // this.externoService.Edit(this.data._id, updateProcedure).subscribe((procedure) => {
      //   this.dialogRef.close(procedure);
      // });
    } else {
      const procedure = ExternalProcedureDto.fromForm({
        requeriments: this.requirements,
        formProcedure: this.TramiteFormGroup.value,
        formApplicant: this.SolicitanteFormGroup.value,
        formRepresentative: this.RepresentanteFormGroup.value,
      });
      console.log(procedure);
      // this.externoService.Add(procedure).subscribe((procedure) => {
      //   this.dialogRef.close(procedure);
      // });
    }
  }

  createFormApplicant() {
    this.SolicitanteFormGroup =
      this.selectedtypeApplicant === 'NATURAL'
        ? this.fb.group({
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
            tipo: [this.selectedtypeApplicant],
          })
        : this.fb.group({
            nombre: ['', Validators.required],
            telefono: [
              '',
              [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
            ],
            tipo: [this.selectedtypeApplicant],
          });
  }

  createFormRepresentative() {
    this.RepresentanteFormGroup = this.registerRepresentative
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

  get validForms(): boolean {
    return this.TramiteFormGroup.valid && this.SolicitanteFormGroup.valid && this.RepresentanteFormGroup.valid;
  }

  createFormApplicantNatural(): FormGroup {
    return this.fb.group({
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
    });
  }
  createFormApplicantJuridico(){
    return  this.fb.group({
      nombre: ['', Validators.required],
      telefono: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
      tipo: [this.selectedtypeApplicant],
    });
  }
}
