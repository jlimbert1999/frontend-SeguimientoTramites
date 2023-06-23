import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CargoService } from '../../services/cargo.service';
import { job } from '../../interfaces/job.interface';

@Component({
  selector: 'app-cargo-dialog',
  templateUrl: './cargo-dialog.component.html',
  styleUrls: ['./cargo-dialog.component.scss']
})
export class CargoDialogComponent {
  superior: any[] = []
  dependents: job[] = []
  FormJob: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    superior: ['', Validators.required]
  });

  constructor(
    private cargoService: CargoService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CargoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: job) {
    this.FormJob.patchValue(data)

  }

  searchDependents(text: string) {
    this.cargoService.searchSuperior(text).subscribe(jobs => {
      this.superior = jobs
    })
  }

  save() {
    if (this.data) {
      this.cargoService.edit(this.data._id, this.FormJob.value).subscribe(data => {
        console.log(data);
      })
      console.log('update');

    }
  }

  selectSuperior(value: any) {
    this.FormJob.get('superior')?.setValue(value._id)

  }

}
