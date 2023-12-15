import { ChangeDetectionStrategy, Component, Inject, OnInit, computed, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectSearchData, NestedPartial } from 'src/app/shared/interfaces';
import { typeProcedure } from 'src/app/administration/interfaces';
import { ExternalService } from '../../services/external.service';
import { external, typeApplicant } from '../../interfaces';
import { ExternalProcedureDto } from '../../dtos';

@Component({
  selector: 'app-register-external',
  templateUrl: './register-external.component.html',
  styleUrls: ['./register-external.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterExternalComponent implements OnInit {
  applicantType = signal<'NATURAL' | 'JURIDICO'>('NATURAL');
  hasRepresentative = signal<boolean>(false);

  segments = signal<MatSelectSearchData<string>[]>([]);
  typesProcedures = signal<MatSelectSearchData<typeProcedure>[]>([]);
  documents: string[] = ['Carnet de identidad', 'Libreta servicio militar', 'Pasaporte'];

  TramiteFormGroup: FormGroup = this.fb.group({
    segment: ['', Validators.required],
    amount: ['', Validators.required],
    reference: ['', Validators.required],
    type: ['', Validators.required],
    cite: [''],
  });
  FormApplicant: FormGroup = this.createFormApplicantNatural();
  FormRepresentative = computed<FormGroup>(() => {
    console.log('change');
    return this.hasRepresentative() ? this.createFormRepresentative() : this.fb.group({});
  });
  requirements: string[] = [];

  constructor(
    private fb: FormBuilder,
    private externoService: ExternalService,
    public dialogRef: MatDialogRef<RegisterExternalComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: ExternalProcedureDto
  ) {
    effect(() => {
      this.FormApplicant =
        this.applicantType() === 'NATURAL' ? this.createFormApplicantNatural() : this.createFormApplicantJuridico();
    });
  }

  ngOnInit(): void {
    if (this.data) {
      const { details, ...values } = this.data;
      // this.TramiteFormGroup.removeControl('segment');
      // this.TramiteFormGroup.removeControl('type');
      // this.TramiteFormGroup.patchValue(values);
      this.applicantType.set(details.solicitante.tipo);
      // console.log(details.solicitante);
      this.FormApplicant.patchValue(details.solicitante);
      // this.hasRepresentative.set(details.representante ? true : false);
      // this.FormApplicant.patchValue(details.representante ?? {});
      console.log(details.solicitante);
    } else {
      this.externoService.getSegments().subscribe((data) => {
        this.segments.set(data.map((segment) => ({ text: segment, value: segment })));
      });
    }
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
          solicitante: this.FormApplicant.value,
          ...(this.data.details.representante && { representante: this.FormRepresentative().value }),
        },
      };
      // this.externoService.Edit(this.data.proc, updateProcedure).subscribe((procedure) => {
      //   this.dialogRef.close(procedure);
      // });
    } else {
      const procedure = ExternalProcedureDto.fromForm({
        requeriments: this.requirements,
        formProcedure: this.TramiteFormGroup.value,
        formApplicant: this.FormApplicant.value,
        formRepresentative: this.FormRepresentative().value,
      });
      this.externoService.Add(procedure).subscribe((procedure) => {
        this.dialogRef.close(procedure);
      });
    }
  }

  getErrorMessageFormAplicant(controlName: string) {
    // const control = this.FormApplicant.get(controlName);
    // if (control?.hasError('required')) {
    //   return 'Este campo es obligatorio';
    // } else if (control?.hasError('pattern')) {
    //   const patternError = control.getError('pattern');
    //   switch (patternError?.requiredPattern) {
    //     case '^[a-zA-Z ]*$':
    //       return 'Solo letras';
    //     case '^[0-9]*$':
    //       return 'Solo numeros';
    //     case '^[a-zA-Z0-9]*$':
    //       return 'Solo letras y numeros';
    //     default:
    //       break;
    //   }
    // } else if (control?.hasError('minlength')) {
    //   const minLengthRequired = control.getError('minlength').requiredLength;
    //   return `Ingrese al menos ${minLengthRequired} caracteres`;
    // } else if (control?.hasError('maxlength')) {
    //   const maxLengthRequired = control.getError('maxlength').requiredLength;
    //   return `Solo ${maxLengthRequired} caracteres`;
    // }
    return '';
  }

  get validForms(): boolean {
    return this.TramiteFormGroup.valid && this.FormApplicant.valid && this.FormRepresentative().valid;
  }

  createFormRepresentative(): FormGroup {
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
      tipo: ['NATURAL'],
    });
  }
  createFormApplicantJuridico(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      telefono: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
      ],
      tipo: ['JURIDICO'],
    });
  }
}
