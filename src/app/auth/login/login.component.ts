import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false]
  })
  recordar_user: string
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.recordar_user = localStorage.getItem('login') || ''
    if (this.recordar_user.length > 0) {
      this.loginForm.controls['remember'].setValue(true)
      this.loginForm.controls['login'].setValue(this.recordar_user)
    }
  }
  login() {
    if (this.loginForm.invalid) {
      return
    }
    this.authService.login(this.loginForm.value!, this.loginForm.get('remember')?.value!).subscribe(role => {
      switch (role) {
        case 'admin':
          this.router.navigateByUrl('/home')
          break;
        case 'RECEPCION':
          this.router.navigateByUrl('/home/tramites-externos')
          break;
        case 'EVALUACION':
          this.router.navigateByUrl('/home/tramites-internos')
          break;
      }

    })
  }


}
