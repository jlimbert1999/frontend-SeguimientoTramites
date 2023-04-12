import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap, throwError, of, BehaviorSubject, Subject, concat } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { account } from '../models/account.model';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  account: account
  menu: any[] = []
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  get token() {
    return localStorage.getItem('token') || ''
  }

  login(formData: any, recordar: boolean) {
    if (recordar) {
      localStorage.setItem('login', formData.login)
    }
    else {
      localStorage.removeItem('login')
    }
    return this.http.post<{ ok: boolean, token: string, imbox: number }>(`${base_url}/login`, formData).pipe(
      map(res => {
        localStorage.setItem('token', res.token)
        return { resources: jwt_decode<account>(res.token).resources, imbox: res.imbox }
      })
    )
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }

  verifyToken(): Observable<boolean> {
    return this.http.get<{ ok: boolean, token: string, menu: any[] }>(`${base_url}/login/verify`).pipe(
      map(resp => {
        this.account = jwt_decode(resp.token)
        console.log(this.account)
        this.menu = resp.menu
        return true
      }), catchError(err => {
        return of(false)
      })
    )
  }
}
