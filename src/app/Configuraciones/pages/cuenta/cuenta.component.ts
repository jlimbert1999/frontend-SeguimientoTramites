import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fadeInOnEnterAnimation } from 'angular-animations';
import Swal from 'sweetalert2';
import { CuentaService } from '../../services/cuenta.service';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500 })
  ]
})
export class CuentaComponent implements OnInit {
  Form_Cuenta: FormGroup = this.fb.group({
    login: ['', Validators.required]
  })
  Account: any
  hide = true;
  actualizar_password: boolean = false
  constructor(
    private _location: Location,
    private fb: FormBuilder,
    private cuentaService: CuentaService,
    private perfilService: PerfilService
  ) { }

  ngOnInit(): void {
    this.perfilService.getDetailsAccount().subscribe(cuenta => {
      this.Account = cuenta
      this.Form_Cuenta.patchValue(cuenta)
    })
  }

  cambiar_formulario(value: boolean) {
    this.actualizar_password = value
    if (this.actualizar_password) {
      this.Form_Cuenta = this.fb.group({
        login: ['', Validators.required],
        password: ['', Validators.required]
      })
    }
    else {
      this.Form_Cuenta = this.fb.group({
        login: ['', Validators.required]
      })
    }
    this.Form_Cuenta.patchValue(this.Account)
  }
  guardar() {
    if (this.Form_Cuenta.valid) {
      this.perfilService.editAccount(this.Form_Cuenta.get('login')?.value, this.Form_Cuenta.get('password')?.value).subscribe(message => {
        Swal.fire(`${message}`, undefined, 'success')
        this._location.back();
      })
    }

  }
  regresar() {
    this._location.back();
  }

}
