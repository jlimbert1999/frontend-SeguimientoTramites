import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap, throwError, of, BehaviorSubject, Subject, concat } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
const base_url = environment.base_url

export interface account {
  id_cuenta: string
  funcionario: {
    nombre_completo: string
    cargo: string
  }
  resources: string[]
  codigo: string
  cite: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  Account: account
  Menu: any[] = []
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
    return this.http.post<{ ok: boolean, token: string, mails: number }>(`${base_url}/login`, formData).pipe(map(
      res => {
        localStorage.setItem('token', res.token)
        let account: account = jwt_decode(res.token)
        return { resources: account.resources, number_mails: res.mails }
      }
    ))
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }

  validar_token(): Observable<boolean> {
    return this.http.get(`${base_url}/login/verify`).pipe(
      map((resp: any) => {
        this.Account = jwt_decode(resp.token)
        this.Menu = resp.menu
        return true
      }), catchError(err => {
        return of(false)
      })
    )
  }
}
