import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { job } from 'src/app/administration/interfaces/job.interface';
import { officer } from 'src/app/administration/interfaces/oficer.interface';
import { CargoService } from 'src/app/administration/services/cargo.service';
import { UsuariosService } from 'src/app/administration/services/usuarios.service';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './officer-dialog.component.html',
  styleUrls: ['./officer-dialog.component.scss']
})
export class OfficerDialogComponent implements OnInit {
  imageURL?: string;
  fileUpload?: File;
  availableJobs: job[] = []
  noJob: boolean = false

  Form_Funcionario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.maxLength(8)]],
    cargo: ['', Validators.required],
    direccion: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: officer,
    public dialogRef: MatDialogRef<OfficerDialogComponent>,
    private usuariosService: UsuariosService,
    private cargoService: CargoService
  ) { }


  ngOnInit(): void {
    if (this.data) {
      const { cargo, ...values } = this.data
      if (!cargo) {
        this.noJob = true
        this.Form_Funcionario.patchValue(values)
      }
      else {
        this.Form_Funcionario.patchValue({ ...values, cargo: cargo._id })
      }
    }
  }


  guardar() {
    if (this.data) {
      this.usuariosService.edit(this.data._id, this.Form_Funcionario.value).subscribe(officer => {
        this.dialogRef.close(officer);
      })
    }
    else {
      this.usuariosService.add(this.Form_Funcionario.value, this.fileUpload).subscribe(officer => {
        this.dialogRef.close(officer)
      })
    }
  }
  changeImage(event: any) {
    this.fileUpload = event.target.files[0];
    if (!this.fileUpload) {
      this.imageURL = undefined;
    }
    else {
      const reader = new FileReader();
      reader.readAsDataURL(this.fileUpload)
      reader.onloadend = () => {
        this.imageURL = reader.result as string;
      }
    }

  }
  searchJob(value: any) {
    this.cargoService.searchJobForOfficer(value).subscribe(data => {
      this.availableJobs = data
    })
  }
  selectJob(job: job) {
    this.Form_Funcionario.get('cargo')?.setValue(job._id)
  }
  removeJob() {
    if (this.noJob) {
      this.Form_Funcionario.removeControl('cargo')
      this.availableJobs = []
    }
    else {
      this.Form_Funcionario.addControl('cargo', new FormControl(this.data?.cargo ? this.data.cargo._id : '', Validators.required))
    }
  }

}
