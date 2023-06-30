import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { job } from 'src/app/Configuraciones/interfaces/job.interface';
import { Funcionario } from 'src/app/Configuraciones/models/funcionario.interface';
import { CargoService } from 'src/app/Configuraciones/services/cargo.service';
import { UsuariosService } from 'src/app/Configuraciones/services/usuarios.service';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.scss']
})
export class UsuarioDialogComponent implements OnInit {
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
    @Inject(MAT_DIALOG_DATA) public data: Funcionario,
    public dialogRef: MatDialogRef<UsuarioDialogComponent>,
    private usuariosService: UsuariosService,
    private cargoService: CargoService
  ) { }


  ngOnInit(): void {
    if (this.data) {
      this.Form_Funcionario.patchValue(this.data)
    }
  }


  guardar() {
    if (this.data) {
      this.usuariosService.edit(this.data._id!, this.Form_Funcionario.value).subscribe(user => {
        console.log(user);
        // this.dialogRef.close(user);
      })
    }
    else {
      this.usuariosService.add(this.Form_Funcionario.value, this.fileUpload).subscribe(user => {
        // console.log(this.Form_Funcionario.value, this.fileUpload);
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
  restartOldJob() {
    // this.f
  }
  removeJob() {
    if (this.noJob) {
      this.Form_Funcionario.removeControl('cargo')
      this.availableJobs = []
    }
    else {
      this.Form_Funcionario.addControl('cargo', new FormControl('', Validators.required));
    }
  }

}
