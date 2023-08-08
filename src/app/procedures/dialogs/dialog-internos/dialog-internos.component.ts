import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, startWith, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InternosService } from '../../services/internos.service';
import { typeProcedure } from 'src/app/administration/interfaces/typeProcedure.interface';
import { Officer } from 'src/app/administration/models/officer.model';
import { CreateInternalProcedureDto } from '../../dtos/create-internal.dto';
import { internal } from '../../interfaces/internal.interface';
import { UpdateInternalProcedureDto } from '../../dtos/update-internal.dto';

@Component({
  selector: 'app-dialog-internos',
  templateUrl: './dialog-internos.component.html',
  styleUrls: ['./dialog-internos.component.scss']
})
export class DialogInternosComponent implements OnInit {
  typesProcedures: typeProcedure[] = []
  filteredEmitter: Observable<Officer[]>;
  filteredReceiver: Observable<Officer[]>;
  TramiteFormGroup: FormGroup

  constructor(
    private authService: AuthService,
    private internoService: InternosService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: internal,
    public dialogRef: MatDialogRef<DialogInternosComponent>) {

  }

  ngOnInit(): void {
    if (this.data) {
      this.TramiteFormGroup = this.createForm('EDIT')
      const { remitente, destinatario, ...values } = this.data
      this.TramiteFormGroup.patchValue({
        nombre_remitente: remitente.nombre,
        cargo_remitente: remitente.cargo,
        nombre_destinatario: destinatario.nombre,
        cargo_destinatario: destinatario.cargo,
        ...values
      })
    }
    else {
      this.TramiteFormGroup = this.createForm('ADD')
      this.internoService.getTypesProcedures().subscribe(data => {
        this.typesProcedures = data
        this.TramiteFormGroup.get('tipo_tramite')?.setValue(data[0]._id)
      })
    }
    this.filteredEmitter = this.setAutocomplete('nombre_remitente')
    this.filteredReceiver = this.setAutocomplete('nombre_destinatario')
  }

  guardar() {
    if (this.data) {
      const procedure = UpdateInternalProcedureDto.fromForm(this.TramiteFormGroup.value)
      this.internoService.Edit(this.data._id, procedure).subscribe(procedure => this.dialogRef.close(procedure))
    }
    else {
      const procedure = CreateInternalProcedureDto.fromForm(this.TramiteFormGroup.value)
      this.internoService.Add(procedure).subscribe(procedure => this.dialogRef.close(procedure))
    }
  }

  setAutocomplete(formControlPath: string) {
    return this.TramiteFormGroup.controls[formControlPath].valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filterOfficers(value))
    )
  }

  private _filterOfficers(value: string) {
    if (value === '') return []
    return this.internoService.getParticipant(value).pipe(officers => officers)
  }

  setJobTitle(officer: Officer, formControlPath: string) {
    this.TramiteFormGroup.get(formControlPath)?.setValue(officer.fulljobtitle)
  }

  createForm(mode: 'ADD' | 'EDIT') {
    return mode === 'ADD'
      ? this.fb.group({
        tipo_tramite: ['', Validators.required],
        detalle: ['', Validators.required],
        cite: [this.authService.code],
        nombre_remitente: [this.authService.account.officer.fullname, Validators.required],
        cargo_remitente: [this.authService.account.officer.jobtitle, Validators.required],
        nombre_destinatario: ['', Validators.required],
        cargo_destinatario: ['', Validators.required],
        cantidad: ['', Validators.required],
      })
      : this.fb.group({
        detalle: ['', Validators.required],
        cite: [''],
        nombre_remitente: ['', Validators.required],
        cargo_remitente: ['', Validators.required],
        nombre_destinatario: ['', Validators.required],
        cargo_destinatario: ['', Validators.required],
        cantidad: ['', Validators.required]
      });
  }
}

