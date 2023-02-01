import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2'
import { LoaderService } from '../auth/services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  constructor(
    private loadingService: LoaderService,
    private router: Router
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    })
    const reqClone = req.clone({
      headers
    })
    this.loadingService.show();
    return next.handle(reqClone).pipe(
      catchError((Error: HttpErrorResponse) => {
        this.manejoErrores(Error)
        if (Error.status === 403) {
          this.router.navigate(['/home'])
        }
        return throwError(() => Error);
      }),
      finalize(() => this.loadingService.hide())
    )
  }
  manejoErrores(error: HttpErrorResponse) {
    if (error.status >= 500) Swal.fire("Error en el sevidor", error.error.message, 'error')
    else if (error.status < 500 && error.status >= 400 && error.status !== 401) {
      Swal.fire("Solicitud incorrecta", error.error.message, 'warning')
    }
    // if (error.status === 401) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Sesion expirada, vuelva a iniciar sesion'
    //   })
    // }
    // else if (error.status === 403) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'No tiene los permisos necesarios'
    //   })
    // }
    // else if (error.status === 404) {
    //   Swal.fire("Sin resultados", error.error.message, 'info')

    // }
    // else if (error.status > 404 && error.status < 500) {
    //   Swal.fire("Solicitud incorrecta", error.error.message, 'info')

    // }
    // else {
    //   Swal.fire('error', error.error.message, 'error')
    // }
    return throwError(() => error);
  }
}

