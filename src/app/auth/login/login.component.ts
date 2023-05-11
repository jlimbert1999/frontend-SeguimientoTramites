import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInDownOnEnterAnimation } from 'angular-animations';
import { NotificationService } from 'src/app/home/services/notification.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    fadeInDownOnEnterAnimation(),
  ]
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
      this.notificationService.number_mails.next(data.imbox)
      // if (data.imbox > 0) {
      //   this.notificationService.addNotificationEvent('Debe revisar su bandeja de entrada', `USTED TIENE ${data.number_mails} TRAMITES PENDIENTES`)
      // }
      if (data.resources.includes('externos')) {
        this.router.navigateByUrl('/home/tramites/externos')
      }
      else if (data.resources.includes('internos')) {
        this.router.navigateByUrl('/home/tramites/internos')
      }
      else {
        this.router.navigateByUrl('/home')
      }
    })
  }


}
