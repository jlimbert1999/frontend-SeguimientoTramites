import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { officer } from 'src/app/administration/interfaces/oficer.interface';
import { UsuariosService } from 'src/app/administration/services/usuarios.service';
import { MatSelectSearchData } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './officer-dialog.component.html',
  styleUrls: ['./officer-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficerDialogComponent implements OnInit {
  hasJob: boolean = true;
  jobs = signal<MatSelectSearchData<string>[]>([]);
  FormOfficer: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.maxLength(8)]],
    direccion: ['', Validators.required],
    cargo: ['', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: officer,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OfficerDialogComponent>,
    private officerService: UsuariosService
  ) {}

  ngOnInit(): void {
    // if (!this.data) return;
    // const { cargo, ...values } = this.data;
    // if (!cargo) this.hasJob.set(false);
    // this.FormOfficer.patchValue({ ...values, cargo: cargo?._id });
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
      this.jobs.set(data.map((job) => ({ value: job._id, text: job.nombre })));
    });
  }

  toggleJob() {
    this.hasJob
      ? this.FormOfficer.addControl('cargo', new FormControl('', Validators.required))
      : this.FormOfficer.removeControl('cargo');
  }
}
