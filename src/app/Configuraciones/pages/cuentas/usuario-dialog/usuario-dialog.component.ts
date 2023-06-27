import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, filter, map, ReplaySubject, Subject, takeUntil, tap } from 'rxjs';
import { job } from 'src/app/Configuraciones/interfaces/job.interface';
import { Funcionario } from 'src/app/Configuraciones/models/funcionario.interface';
import { CargoService } from 'src/app/Configuraciones/services/cargo.service';
import { UsuariosService } from 'src/app/Configuraciones/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.scss']
})
export class UsuarioDialogComponent implements OnInit {
  imageURL?: string;
  fileUpload: File;
  availableJobs: job[] = []
  noJob: boolean = false
  Form_Funcionario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.maxLength(8)]],
    cargo: ['', Validators.required],
    direccion: ['', Validators.required],
    linkUrl: [null]
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
    else {

    }
  }

  guardar() {
    // if (this.Form_Funcionario.valid) {
    //   if (this.data) {
    //     this.usuariosService.edit(this.data._id!, this.Form_Funcionario.value).subscribe(user => {
    //       this.dialogRef.close(user)
    //     })
    //   }
    //   else {
    //     this.usuariosService.add(this.Form_Funcionario.value).subscribe(user => {
    //       this.dialogRef.close(user)
    //     })
    //   }

    // }
    console.log(this.Form_Funcionario.value);

  }

  // Image Preview
  showPreview(event: any) {
    const file = event.target.files[0];
    this.Form_Funcionario.patchValue({
      imgUrl: file
    });

    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
  }
  searchJob(value: any) {
    this.cargoService.searchJobForOfficer(value).subscribe(data => {
      this.availableJobs = data
    })
  }
  selectJob(job: job) {
    Swal.fire({
      title: 'Cambiar de cargo?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
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
