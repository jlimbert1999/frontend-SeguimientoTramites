import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';

import { CargoService } from '../../services/cargo.service';
import { job } from '../../interfaces/job.interface';
import { jobDto } from '../../dto/job.dto';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.scss'],
})
export class JobDialogComponent implements OnInit {
  jobs: job[] = [];
  dependentJobs: job[] = [];
  FormJob: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    isRoot: [false, Validators.required],
  });

  constructor(
    private cargoService: CargoService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<JobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: job
  ) {}
  ngOnInit(): void {
    if (this.data) {
      this.FormJob.patchValue(this.data);
      this.cargoService.getDependentsOfSuperior(this.data._id).subscribe((jobs) => (this.dependentJobs = jobs));
    }
  }

  searchDependents(text: string) {
    this.cargoService.searchSuperior(text).subscribe((jobs) => {
      this.jobs = jobs;
    });
  }

  save() {
    const newJob: jobDto = {
      ...this.FormJob.value,
      dependents: this.dependentJobs.map((element) => element._id),
    };
    if (this.data) {
      this.cargoService.edit(this.data._id, newJob).subscribe((job) => this.dialogRef.close(job));
    } else {
      this.cargoService.add(newJob).subscribe((job) => this.dialogRef.close(job));
    }
  }

  selectDependents(value: any) {
    const job: job = value;
    if (this.dependentJobs.some((element) => element._id === job._id)) return;
    this.dependentJobs.unshift(job);
    this.jobs = [];
  }

  removeDependentJob(position: number) {
    if (this.data) {
      const dependent = this.dependentJobs[position];
      this.cargoService.removeDependent(dependent._id).subscribe((_) => this.dependentJobs.splice(position, 1));
    } else {
      this.dependentJobs.splice(position, 1);
    }
  }
}
