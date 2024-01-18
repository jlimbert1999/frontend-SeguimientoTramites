import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { institution } from 'src/app/administration/interfaces/institution.interface';
import { InstitucionesService } from 'src/app/administration/services/instituciones.service';

@Component({
  selector: 'app-institution-dialog',
  templateUrl: './institution-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionDialogComponent implements OnInit {
  FormInstitution: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    sigla: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern(/^[A-Za-z-]+$/)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: institution | undefined,
    public dialogRef: MatDialogRef<InstitutionDialogComponent>,
    private institucionesService: InstitucionesService
  ) {}

  ngOnInit(): void {
    if (this.data) this.FormInstitution.patchValue(this.data);
  }
  save() {
    const subscription = this.data
      ? this.institucionesService.edit(this.data._id, this.FormInstitution.value)
      : this.institucionesService.add(this.FormInstitution.value);
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }
}
