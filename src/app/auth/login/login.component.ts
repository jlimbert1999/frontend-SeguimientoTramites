import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hidePassword = true;
  loginForm = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false],
  });
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/main']);
      return;
    }
    const loginSaved = localStorage.getItem('login');
    if (loginSaved) {
      this.loginForm.controls['remember'].setValue(true);
      this.loginForm.controls['login'].setValue(loginSaved);
    }
  }
  login() {
    if (this.loginForm.invalid) return;
    this.authService
      .login(
        {
          login: this.loginForm.get('login')?.value!,
          password: this.loginForm.get('password')?.value!,
        },
        this.loginForm.get('remember')?.value!
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
