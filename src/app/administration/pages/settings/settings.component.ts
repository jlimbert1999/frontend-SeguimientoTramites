import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { account } from '../../interfaces';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  myAccount = signal<account | null>(null);
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

  constructor(private authService: AuthService, private fb: FormBuilder, private themeService: AppearanceService) {}
  ngOnInit(): void {
    this.getMyAccount();
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

  private getMyAccount() {
    this.authService.getMyAccount().subscribe((resp) => this.myAccount.set(resp));
  }

  save() {
    // this.authService.updateMyAccount(this.Form_Cuenta.get('password')?.value).subscribe((newAccount) => {
    //   this.myAccount = newAccount;
    //   this.formDirective.resetForm();
    // });
  }

  get isDarkTheme() {
    return this.themeService.isDarkTheme();
  }
  toggleDarkTheme() {
    this.themeService.toggleTheme();
  }
}
