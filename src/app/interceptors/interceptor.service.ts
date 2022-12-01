import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    })
    const reqClone = req.clone({
      headers
    })
    return next.handle(reqClone).pipe(
      catchError(this.manejoErrores)
    )
  }
  manejoErrores(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.router.navigate(['/login'])
      console.log('No autorizado, vuelva a iniciar sesion');
    }
    else if (error.status === 403) {
      Swal.fire({
        icon: 'warning',
        title: 'No tiene los permisos necesarios'
      })
    }

    else {
      Swal.fire('error', error.error.message, 'error')
    }
    return throwError(() => error);

  }
}

