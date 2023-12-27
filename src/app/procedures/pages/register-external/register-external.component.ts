import { ChangeDetectionStrategy, Component, Inject, OnInit, computed, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { typeProcedure } from 'src/app/administration/interfaces';
import { ExternalService } from '../../services/external.service';
import { typeApplicant } from '../../interfaces';
import { ExternalProcedure } from '../../models';
import { HandleFormErrorMessages } from '../../helpers';

@Component({
  selector: 'app-register-external',
  templateUrl: './register-external.component.html',
  styleUrls: ['./register-external.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterExternalComponent implements OnInit {
  applicantType = signal<typeApplicant>('NATURAL');
  hasRepresentative = signal<boolean>(false);

  segments = signal<MatSelectSearchData<string>[]>([]);
  typesProcedures = signal<MatSelectSearchData<typeProcedure>[]>([]);
  readonly documents: string[] = ['Carnet de identidad', 'Libreta servicio militar', 'Pasaporte'];

  FormProcedure: FormGroup = this.fb.group({
    segment: ['', Validators.required],
    amount: ['', Validators.required],
    reference: ['', Validators.required],
    type: ['', Validators.required],
    cite: [''],
  });

  FormApplicant = computed<FormGroup>(() =>
    this.applicantType() === 'NATURAL' ? this.createFormApplicantNatural() : this.createFormApplicantJuridico()
  );
  FormRepresentative = computed<FormGroup>(() =>
    this.hasRepresentative() ? this.createFormRepresentative() : this.fb.group({})
  );
  requirements: string[] = [];
  ErrorMessages = HandleFormErrorMessages;

  constructor(
    private fb: FormBuilder,
    private externoService: ExternalService,
    public dialogRef: MatDialogRef<RegisterExternalComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data?: ExternalProcedure
  ) {}

  ngOnInit(): void {
    if (this.data) {
      const { details, ...values } = this.data;
      this.FormProcedure.removeControl('type');
      this.FormProcedure.removeControl('segment');
      this.FormProcedure.patchValue(values);
      this.applicantType.set(details.solicitante.tipo);

      this.applicantType.set(details.solicitante.tipo);
      this.FormApplicant().patchValue(details.solicitante);

      this.hasRepresentative.set(details.representante ? true : false);
      this.FormRepresentative().patchValue(details.representante ?? {});
    } else {
      this.externoService.getSegments().subscribe((data) => {
        this.segments.set(data.map((segment) => ({ text: segment, value: segment })));
      });
    }
  }

  getTypesProceduresBySegment(segment: string) {
    this.FormProcedure.get('segment')?.setValue(segment);
    this.FormProcedure.get('type')?.setValue('');
    this.requirements = [];
    this.externoService.getTypesProceduresBySegment(segment).subscribe((data) => {
      this.typesProcedures.set(data.map((type) => ({ value: type, text: type.nombre })));
    });
  }
  selectTypeProcedure(type: typeProcedure) {
    this.FormProcedure.get('type')?.setValue(type._id);
    this.requirements = type.requerimientos.filter((requirement) => requirement.nombre).map((type) => type.nombre);
  }

  save() {
    if (this.data) {
      this.externoService
        .edit({
          id_procedure: this.data._id,
          FormProcedure: this.FormProcedure.value,
          FormApplicant: this.FormApplicant().value,
          FormRepresentative: this.FormRepresentative().value,
        })
        .subscribe((procedure) => {
          this.dialogRef.close(procedure);
        });
    } else {
      this.externoService
        .add({
          FormProcedure: this.FormProcedure.value,
          FormApplicant: this.FormApplicant().value,
          FormRepresentative: this.FormRepresentative().value,
          Requeriments: this.requirements,
        })
        .subscribe((procedure) => {
          this.dialogRef.close(procedure);
        });
    }
  }

  get validForms(): boolean {
    return this.FormProcedure.valid && this.FormApplicant().valid && this.FormRepresentative().valid;
  }
  private createFormRepresentative(): FormGroup {
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
  private createFormApplicantNatural(): FormGroup {
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
  private createFormApplicantJuridico(): FormGroup {
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
