import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, startWith, switchMap } from 'rxjs';

import { AuthService } from 'src/app/auth/services/auth.service';
import { InternalService } from '../../services/internal.service';
import { Officer } from 'src/app/administration/models/officer.model';
import { typeProcedure } from 'src/app/administration/interfaces';
import { InternalProcedure } from '../../models';
import { MatSelectSearchData } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-register-internal',
  templateUrl: './register-internal.component.html',
  styleUrls: ['./register-internal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterInternalComponent implements OnInit {
  typesProcedures = signal<MatSelectSearchData<typeProcedure>[]>([]);
  currentTypeProcedure: typeProcedure | null = null;

  filteredEmitter: Observable<Officer[]>;
  filteredReceiver: Observable<Officer[]>;

  FormProcedure: FormGroup = this.fb.group({
    type: ['', Validators.required],
    amount: ['', Validators.required],
    segment: ['', Validators.required],
    reference: ['', Validators.required],
    fullname_receiver: ['', Validators.required],
    jobtitle_receiver: ['', Validators.required],
    fullname_emitter: [this.authService.account()?.officer.fullname, Validators.required],
    jobtitle_emitter: [this.authService.account()?.officer.jobtitle, Validators.required],
    cite: ['000-000'],
  });

  constructor(
    private readonly authService: AuthService,
    private readonly internoService: InternalService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: InternalProcedure,
    public dialogRef: MatDialogRef<RegisterInternalComponent>
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.FormProcedure.removeControl('type');
      this.FormProcedure.removeControl('segment');
      const { details, ...values } = this.data;
      this.FormProcedure.patchValue({
        fullname_emitter: details.remitente.nombre,
        jobtitle_emitter: details.remitente.cargo,
        fullname_receiver: details.destinatario.nombre,
        jobtitle_receiver: details.destinatario.cargo,
        ...values,
      });
    } else {
      this.internoService.getTypesProcedures().subscribe((data) => {
        this.typesProcedures.set(data.map((type) => ({ value: type, text: type.nombre })));
        this.currentTypeProcedure = data[0];
        this.selectTypeProcedure(this.currentTypeProcedure);
      });
    }
    this.filteredEmitter = this.setAutocomplete('fullname_emitter');
    this.filteredReceiver = this.setAutocomplete('fullname_receiver');
  }

  save() {
    const observable = this.data
      ? this.internoService.edit(this.data._id, this.FormProcedure.value)
      : this.internoService.add(this.FormProcedure.value);
    observable.subscribe((procedure) => this.dialogRef.close(procedure));
  }

  selectTypeProcedure(type: typeProcedure) {
    this.FormProcedure.get('type')?.setValue(type._id);
    this.FormProcedure.get('segment')?.setValue(type.segmento);
  }

  setAutocomplete(formControlPath: string) {
    return this.FormProcedure.controls[formControlPath].valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap((value) => this._filterOfficers(value))
    );
  }
  private _filterOfficers(value: string) {
    if (value === '') return [];
    return this.internoService.findParticipant(value).pipe((officers) => officers);
  }

  setJobTitle(officer: Officer, formControlPath: string) {
    this.FormProcedure.get(formControlPath)?.setValue(officer.jobtitle);
  }
}
