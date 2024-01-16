import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { officer } from 'src/app/administration/interfaces/oficer.interface';
import { UsuariosService } from 'src/app/administration/services/usuarios.service';
import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { AlertService } from 'src/app/shared/services';
import { job } from '../../interfaces';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './officer-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficerDialogComponent implements OnInit {
  hasJob: boolean = true;
  currentJobName = signal<string | undefined>(undefined);
  jobs = signal<MatSelectSearchData<job>[]>([]);
  FormOfficer: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.maxLength(8)]],
    direccion: ['', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: officer | undefined,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OfficerDialogComponent>,
    private officerService: UsuariosService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      const { cargo, ...values } = this.data;
      this.FormOfficer.patchValue(values);
      if (cargo) {
        this.setJob(cargo);
      }
    }
  }

  guardar() {
    const subscription = this.data
      ? this.officerService.edit(this.data._id, this.FormOfficer.value)
      : this.officerService.add(this.FormOfficer.value);
    subscription.subscribe((officer) => {
      // this.dialogRef.close(officer);
    });
  }
  searchJob(value: string) {
    this.officerService.searchJobs(value).subscribe((data) => {
      this.jobs.set(data.map((job) => ({ value: job, text: job.nombre })));
    });
  }

  setJob(job: job) {
    this.FormOfficer.setControl('cargo', new FormControl(job._id));
    this.currentJobName.set(job.nombre);
  }

  removeJob() {
    if (this.data?.cargo) {
      this.alertService.showQuestionAlert(
        `¿Quitar asignacion del cargo ${this.data.cargo?.nombre}?`,
        `El funcionario ${this.data.nombre} ${this.data.paterno} ${this.data.materno} se mostrara como (Sin cargo)`,
        () => this.removeAssignedJob()
      );
    } else {
      this.FormOfficer.removeControl('cargo');
      this.currentJobName.set(undefined);
    }
  }

  private removeAssignedJob() {
    this.officerService.removeJob(this.data?._id!).subscribe(() => {
      this.FormOfficer.removeControl('cargo');
      this.currentJobName.set(undefined);
    });
  }
}
