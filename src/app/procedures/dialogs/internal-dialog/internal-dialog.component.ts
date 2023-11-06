import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, startWith, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InternalService } from '../../services/internal.service';
import { Officer } from 'src/app/administration/models/officer.model';
import { typeProcedure } from 'src/app/administration/interfaces';
import { InternalProcedureDto } from '../../dtos';
import { NestedPartial } from 'src/app/shared/interfaces/nested-partial';
import { internal } from '../../interfaces';

@Component({
  selector: 'app-internal-dialog',
  templateUrl: './internal-dialog.component.html',
  styleUrls: ['./internal-dialog.component.scss'],
})
export class InternalDialogComponent implements OnInit {
  typesProcedures: typeProcedure[] = [];
  filteredEmitter: Observable<Officer[]>;
  filteredReceiver: Observable<Officer[]>;
  TramiteFormGroup: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly internoService: InternalService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: internal,
    public dialogRef: MatDialogRef<InternalDialogComponent>
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.TramiteFormGroup = this.createForm('EDIT');
      const { details, ...values } = this.data;
      this.TramiteFormGroup.patchValue({
        fullname_emitter: details.remitente.nombre,
        jobtitle_emitter: details.remitente.cargo,
        fullname_receiver: details.destinatario.nombre,
        jobtitle_receiver: details.destinatario.cargo,
        ...values,
      });
    } else {
      this.TramiteFormGroup = this.createForm('ADD');
      this.internoService.getTypesProcedures().subscribe((data) => {
        this.typesProcedures = data;
        this.TramiteFormGroup.get('type')?.setValue(data[0]._id);
        this.TramiteFormGroup.get('segment')?.setValue(data[0].segmento);
      });
    }
    this.filteredEmitter = this.setAutocomplete('fullname_emitter');
    this.filteredReceiver = this.setAutocomplete('fullname_receiver');
  }

  save() {
    if (this.data) {
      const { fullname_emitter, fullname_receiver, jobtitle_emitter, jobtitle_receiver, ...values } =
        this.TramiteFormGroup.value;
      const procedure: NestedPartial<InternalProcedureDto> = {
        procedure: values,
        details: {
          remitente: {
            nombre: fullname_emitter,
            cargo: jobtitle_emitter,
          },
          destinatario: {
            nombre: fullname_receiver,
            cargo: jobtitle_receiver,
          },
        },
      };
      this.internoService.Edit(this.data._id, procedure).subscribe((procedure) => this.dialogRef.close(procedure));
    } else {
      const procedure = InternalProcedureDto.fromForm(this.TramiteFormGroup.value);
      this.internoService.Add(procedure).subscribe((procedure) => this.dialogRef.close(procedure));
    }
  }

  setAutocomplete(formControlPath: string) {
    return this.TramiteFormGroup.controls[formControlPath].valueChanges.pipe(
      startWith(''),
      switchMap((value) => this._filterOfficers(value))
    );
  }

  private _filterOfficers(value: string) {
    if (value === '') return [];
    return this.internoService.getParticipant(value).pipe((officers) => officers);
  }

  setJobTitle(officer: Officer, formControlPath: string) {
    this.TramiteFormGroup.get(formControlPath)?.setValue(officer.jobtitle);
  }

  createForm(mode: 'ADD' | 'EDIT') {
    return mode === 'ADD'
      ? this.fb.group({
          type: ['', Validators.required],
          segment: ['', Validators.required],
          reference: ['', Validators.required],
          cite: [this.authService.code],
          amount: ['', Validators.required],
          fullname_emitter: [this.authService.account.officer.fullname, Validators.required],
          jobtitle_emitter: [this.authService.account.officer.jobtitle, Validators.required],
          fullname_receiver: ['', Validators.required],
          jobtitle_receiver: ['', Validators.required],
        })
      : this.fb.group({
          reference: ['', Validators.required],
          cite: [''],
          amount: ['', Validators.required],
          fullname_emitter: ['', Validators.required],
          jobtitle_emitter: ['', Validators.required],
          fullname_receiver: ['', Validators.required],
          jobtitle_receiver: ['', Validators.required],
        });
  }
}
