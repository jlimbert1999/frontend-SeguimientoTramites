import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuentaService } from 'src/app/administration/services/cuenta.service';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOnEnterAnimation } from 'angular-animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500 })
  ]
})
export class PerfilComponent {
  Form_Cuenta: FormGroup = this.fb.group({
    login: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(15), Validators.pattern(/^[A-Za-z0-9]*$/)]]
  })
  Account: any
  hide = true;
  changePassword: boolean = false

  constructor(
    private cuentaService: CuentaService,
    private activateRoute: ActivatedRoute,
    private _location: Location,
    private fb: FormBuilder,

  ) {
    this.activateRoute.params.subscribe(params => {
      this.cuentaService.getMyAccount(params['id_account']).subscribe(account => {
        this.Account = account
        this.Form_Cuenta.patchValue(account)
      })
    })
  }
  changeForm(value: boolean) {
    this.changePassword = value
    this.changePassword
      ? this.Form_Cuenta = this.fb.group({
        login: [{ value: this.Account.login, disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(15), Validators.pattern(/^[A-Za-z0-9]*$/)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^\S+$/)]]
      })
      : this.Form_Cuenta = this.fb.group({
        login: [{ value: this.Account.login, disabled: true }, [Validators.required, Validators.minLength(4), Validators.maxLength(15), Validators.pattern(/^[A-Za-z0-9]*$/)]]
      })
  }
  back() {
    this._location.back()
  }

  getErrorMessageLoginField() {
    const form: FormControl = (this.Form_Cuenta.get('login') as FormControl);
    return form.hasError('required') ?
      'El nombre de usuario es necesario' :
      form.hasError('maxlength') ?
        'Ingrese maximo 15 caracters' :
        form.hasError('minlength') ?
          'Ingrese al menos 4 caracters' :
          form.hasError('pattern') ?
            'No se permiten espacios ni caracteres especiales' : '';
  }
  getErrorMessagePasswordField() {
    const form: FormControl = (this.Form_Cuenta.get('password') as FormControl);
    return form.hasError('required') ?
      'La contraseña es requerida' :
      form.hasError('maxlength') ?
        'Ingrese maximo 20 caracters' :
        form.hasError('minlength') ?
          'Ingrese al menos 6 caracters' :
          form.hasError('pattern') ?
            'No se permiten espacios' : '';
  }
  save() {
    this.cuentaService.updateMyAccount(this.Account._id, this.Form_Cuenta.get('login')?.value, this.Form_Cuenta.get('password')?.value).subscribe(login => {
      this.Account.login = login
      Swal.fire({
        icon: 'success',
        title: 'Cuenta actualizada',
        text: `Se actualizo el nombre de usuario ${this.changePassword === true ? 'y contraseña' : ''} correctamente`,
        confirmButtonText: 'Aceptar'
      })
      this.changeForm(false)
    })
  }

}
