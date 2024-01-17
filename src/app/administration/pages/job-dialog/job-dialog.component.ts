import { Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

import { CargoService } from '../../services/cargo.service';
import { job } from '../../interfaces/job.interface';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobDialogComponent implements OnInit {
  name = new FormControl<string>('', { nonNullable: true } && [Validators.required, Validators.minLength(4)]);

  constructor(
    private cargoService: CargoService,
    private dialogRef: MatDialogRef<JobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public job?: job
  ) {}
  ngOnInit(): void {
    if (this.job) {
      this.name.setValue(this.job.nombre);
    }
  }
  save() {
    const supscription = this.job
      ? this.cargoService.edit(this.job._id, this.name.value!)
      : this.cargoService.add(this.name.value!);
    supscription.subscribe((job) => {
      this.dialogRef.close(job);
    });
  }
}
