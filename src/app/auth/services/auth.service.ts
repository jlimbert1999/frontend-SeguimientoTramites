import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap, throwError, of, BehaviorSubject, Subject, concat } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { Router } from '@angular/router';
import { account } from '../models/account.model';

import { loginData } from '../interfaces/auth.interface';
import jwtDecode from 'jwt-decode';
import { myAccount } from '../interfaces/my-account.interface';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  account: account
  code: string
  resources: string[]
  menu: any[] = []
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  get token() {
    return localStorage.getItem('token') || ''
  }

  login(formData: loginData, recordar: boolean) {
    recordar ? localStorage.setItem('login', formData.login) : localStorage.removeItem('login')
    return this.http.post<{ token: string, resources: string[], imbox?: number }>(`${base_url}/auth`, formData).pipe(
      map(resp => {
        this.account = jwtDecode(resp.token)
        this.resources = resp.resources
        localStorage.setItem('token', resp.token)
        return { resources: resp.resources, imbox: resp.imbox }
      })
    )
  }
  getMyAuthDetalis() {
    return this.http.get<myAccount>(`${base_url}/auth/${this.account.id_account}`).pipe(
      map(resp => resp)
    )
  }
  updateMyAccount(password: string) {
    return this.http.put<myAccount>(`${base_url}/auth/${this.account.id_account}`, { password }).pipe(
      map(resp => resp)
    )
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http.get<{ token: string, resources: string[], code: string, imbox?: number, menu: any[] }>(`${base_url}/auth`).pipe(
      map(resp => {
        console.log(resp);
        this.account = jwtDecode(resp.token)
        this.resources = resp.resources
        localStorage.setItem('token', resp.token)
        this.code = resp.code
        this.menu = resp.menu
        // resp.imbox ? this.notificationService.showNotificationPendingMails(resp.imbox) : null
        return true
      }), catchError(err => {
        return of(false)
      })
    )
  }
}
