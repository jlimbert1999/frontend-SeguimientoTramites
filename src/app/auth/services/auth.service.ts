import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap, throwError, of, BehaviorSubject, Subject, concat } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  Account: {
    id_cuenta: string,
    funcionario: {
      nombre_completo: string
      cargo: string
    }
    rol: string,
    codigo: string,
    cite: string
  }
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
    return this.http.post<{ ok: boolean, token: string, number_mails: number }>(`${base_url}/login`, formData).pipe(map(
      (res: any) => {
        localStorage.setItem('token', res.token)
        let account: any = jwt_decode(res.token)
        return { rol: account.rol, number_mails: res.number_mails }
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
        this.Menu = resp.Menu
        return true
      }), catchError(err => {
        return of(false)
      })
    )
  }
}
