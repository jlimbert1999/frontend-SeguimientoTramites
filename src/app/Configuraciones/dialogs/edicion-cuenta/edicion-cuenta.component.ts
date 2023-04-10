import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, Subject, forkJoin, takeUntil } from 'rxjs';
import { Cuenta } from 'src/app/Configuraciones/models/cuenta.interface';
import { HojaUsuarios } from 'src/app/Configuraciones/pdfs/usuarios';
import { CuentaService } from 'src/app/Configuraciones/services/cuenta.service';
import Swal from 'sweetalert2';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-edicion-cuenta',
  templateUrl: './edicion-cuenta.component.html',
  styleUrls: ['./edicion-cuenta.component.css']
})
export class EdicionCuentaComponent implements OnInit {
  Form_Cuenta: FormGroup = this.fb.group({
    login: ['', Validators.required],
    rol: ['', Validators.required]
  });
  cambiar_password: boolean = false;
  roles: any[] = []



  protected users: any[] = [];
  public userCtrl: FormControl = new FormControl();
  public userFilterCtrl: FormControl = new FormControl();
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(0);
  protected _onDestroy = new Subject<void>();

  show_selectUser: boolean = false

  // if user is assign or unlink, button save is required
  lock_cancel: boolean = false

  details: { externos?: number, internos?: number, entradas?: number, salidas?: number }


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Cuenta,
    private fb: FormBuilder,
    private cuentaService: CuentaService,
    public dialogRef: MatDialogRef<EdicionCuentaComponent>,
    private rolService: RolService
  ) { }

  ngOnInit(): void {
    forkJoin([this.cuentaService.getDetails(this.data._id), this.rolService.get()]).subscribe(
      data => {
        this.details = data[0]
        this.roles = data[1]
        this.Form_Cuenta.patchValue(this.data)
      }
    )

  }

  changeForm(value: boolean) {
    this.cambiar_password = value;
    if (value) {
      this.Form_Cuenta = this.fb.group({
        login: [this.data.login, Validators.required],
        rol: [this.data.rol, Validators.required],
        password: [this.data.funcionario ? this.data.funcionario.dni : '0000', Validators.required],
      });
    } else {
      this.Form_Cuenta = this.fb.group({
        login: [this.data.login, Validators.required],
        rol: [this.data.rol, Validators.required]
      });
    }
  }

  changeUser() {
    this.show_selectUser = true
    this.filteredUsers.next(this.users);
    this.userFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((text) => {
        if (text !== '') {
          this.cuentaService.getUsersForAssign(text).subscribe(users => {
            this.filteredUsers.next(users)
          })
        }
      });
  }
  cancelChangeUser() {
    this.show_selectUser = false
  }

  unlinkUser() {
    Swal.fire({
      title: `Desvincular la cuenta?`,
      text: `${this.data.funcionario!.nombre} ${this.data.funcionario!.paterno} ${this.data.funcionario!.materno} perdera el acceso y la cuenta sera deshabilitada hasta una nueva asignacion`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentaService.unlinkUser(this.data._id).subscribe(message => {
          this.data.funcionario = undefined
          this.lock_cancel = true
          Swal.fire({
            icon: 'success',
            text: message
          })
        })
      }
    })
  }

  selectUserAssign(value: any) {
    Swal.fire({
      title: `Asignar la cuenta a un nuevo funcionario?`,
      text: `${value.nombre} ${value.paterno} ${value.materno} (${value.cargo}) podra administrar los tramites registrados`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentaService.linkUser(
          this.data._id,
          value._id,
          this.data.funcionario ? this.data.funcionario._id : undefined
        ).subscribe(message => {
          Swal.fire({
            icon: 'success',
            text: message
          })
          this.Form_Cuenta.get('login')?.setValue(`${value.nombre}${value.paterno[0]}${value.materno[0]}`.replace(/\s/g, ''))
          this.Form_Cuenta.get('password')?.setValue(value.dni)
          this.data.funcionario = value
          this.lock_cancel = true
          this.show_selectUser = false
        })
      }
    })
  }

  save() {
    this.cuentaService.edit(this.data._id, this.Form_Cuenta.value).subscribe(cuenta => {
      if (this.cambiar_password && this.data.funcionario) {
        HojaUsuarios(
          cuenta,
          this.Form_Cuenta.get('login')?.value,
          this.Form_Cuenta.get('password')?.value
        )
      }
      this.dialogRef.close(cuenta)
    })
  }

}
