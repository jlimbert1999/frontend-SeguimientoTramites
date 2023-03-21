import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/home/services/notification.service';
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
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/home'])
    }

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
    this.authService.login(this.loginForm.value!, this.loginForm.get('remember')?.value!).subscribe(data => {
      this.notificationService.number_mails.next(data.number_mails)
      if (data.number_mails > 0) {
        this.notificationService.addNotificationEvent('Debe revisar su bandeja de entrada', `USTED TIENE ${data.number_mails} TRAMITES PENDIENTES`)
      }
      switch (data.rol) {
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
