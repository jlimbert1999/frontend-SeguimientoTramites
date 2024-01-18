import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UsuariosService } from 'src/app/administration/services/usuarios.service';
import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { AlertService } from 'src/app/shared/services';
import { job } from '../../interfaces';
import { Officer } from '../../models/officer.model';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './officer-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficerDialogComponent implements OnInit {
  currentJobName = signal<string | undefined>(undefined);
  jobs = signal<MatSelectSearchData<job>[]>([]);
  FormOfficer: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(6), Validators.maxLength(8)]],
    telefono: [
      '',
      [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(6), Validators.maxLength(8)],
    ],
    direccion: ['Sacaba', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public officer: Officer | undefined,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OfficerDialogComponent>,
    private officerService: UsuariosService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    if (this.officer) {
      const { cargo, ...values } = this.officer;
      this.FormOfficer.patchValue(values);
      if (cargo) {
        this.setJob(cargo);
      }
    }
  }

  save() {
    const subscription = this.officer
      ? this.officerService.edit(this.officer._id, this.FormOfficer.value)
      : this.officerService.add(this.FormOfficer.value);
    subscription.subscribe((officer) => {
      this.dialogRef.close(officer);
    });
  }

  searchJob(value: string) {
    this.officerService.searchJobs(value).subscribe((officer) => {
      this.jobs.set(officer.map((job) => ({ value: job, text: job.nombre })));
    });
  }

  setJob(job: { nombre: string; _id: string }) {
    this.FormOfficer.setControl('cargo', new FormControl(job._id));
    this.currentJobName.set(job.nombre);
  }

  removeJob() {
    if (this.officer?.cargo) {
      this.alertService.showQuestionAlert(
        `¿Quitar asignacion del cargo ${this.officer.cargo?.nombre}?`,
        `El funcionario ${this.officer.fullname} se mostrara como (Sin cargo)`,
        () => this.removeAssignedJob()
      );
    } else {
      this.FormOfficer.removeControl('cargo');
      this.currentJobName.set(undefined);
    }
  }

  private removeAssignedJob() {
    this.officerService.removeJob(this.officer?._id!).subscribe(() => {
      this.FormOfficer.removeControl('cargo');
      this.currentJobName.set(undefined);
      delete this.officer?.cargo;
    });
  }
}
