import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Location } from '@angular/common';
import { account } from '../../interfaces';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  myAccount: account;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  Form_Cuenta: FormGroup = this.fb.group({
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\/\\-]+$/),
      ],
    ],
  });
  hide = true;
  darkTheme = false;

  logoUrl = 'assets/logo.png'; // Ruta de tu logotipo (reemplaza 'assets/logo.png' por la ruta correcta)
  appName = 'Nombre de la Aplicación'; // Puedes establecer el nombre de la aplicación aquí
  appVersion = '1.0.0'; // Puedes establecer la versión de la aplicación aquí

  constructor(
    private authService: AuthService,
    private _location: Location,
    private fb: FormBuilder,
    public themeService: ThemeService
  ) {
    this.authService.getMyAuthDetalis().subscribe((account) => {
      this.myAccount = account;
      console.log(account);
    });
  }
  ngOnInit(): void {
    if (localStorage.getItem('theme')) this.darkTheme = true;
  }

  getErrorMessage() {
    if (this.Form_Cuenta.get('password')?.hasError('required')) {
      return 'Este campo es requerido';
    } else if (this.Form_Cuenta.get('password')?.hasError('pattern')) {
      return 'No se permiten caracteres especiales';
    } else if (this.Form_Cuenta.get('password')?.hasError('minlength')) {
      return 'El campo debe tener al menos 6 caracteres';
    }
    return '';
  }

  save() {
    this.authService
      .updateMyAccount(this.Form_Cuenta.get('password')?.value)
      .subscribe((newAccount) => {
        this.myAccount = newAccount;
        this.formDirective.resetForm();
      });
  }
  toggleDarkTheme() {
    this.themeService.isDarkTheme(this.darkTheme);
  }
}
