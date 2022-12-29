import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap, throwError, of, BehaviorSubject, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import Swal from 'sweetalert2'
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { SocketService } from 'src/app/Tramites/services/socket.service';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  Detalles_Cuenta: { id_cuenta: string, id_funcionario: string, funcionario: string, cargo: string, rol: string, institucion: string, dependencia: string, codigo: string }
  Menu: any[] = []
  constructor(private http: HttpClient, private router: Router, private socketService: SocketService) { }

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
    return this.http.post(`${base_url}/login`, formData).pipe(tap(
      (res: any) => {
        localStorage.setItem('token', res.token)
      }, (error) => {
        Swal.fire('Error ingreso', error.error.message, 'error')
      }
    ))
  }
  logout() {
    this.socketService.disconnect()
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }
  validar_token(): Observable<boolean> {
    return this.http.get(`${base_url}/login/verify`).pipe(
      map((resp: any) => {
        console.log(this.Detalles_Cuenta)
        this.Detalles_Cuenta = jwt_decode(resp.token)
        this.Menu = resp.Menu
        return true
      }), catchError(err => {
        return of(false)
      })
    )
  }
}
