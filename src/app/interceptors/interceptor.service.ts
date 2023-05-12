import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, throwError } from 'rxjs';
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
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`)
    const reqClone = req.clone({
      headers
    })
    this.loadingService.show()
    return next.handle(reqClone).pipe(
      catchError((Error: HttpErrorResponse) => {
        this.handleErrors(Error)
        return throwError(() => Error);
      }),
      finalize(() => this.loadingService.hide())
    )
  }

  handleErrors(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.router.navigate(['/login'])
    }
    else if (error.status === 403) {
      Swal.fire("Sin autorizacion", error.error.message, 'warning',)
    }
    else if (error.status === 404) {
      Swal.fire("El recurso solicitado no existe", error.error.message, 'info')
    }
    else if (error.status >= 500) {
      Swal.fire("Error en el sevidor", error.error.message, 'error')
    }
    else if (error.status < 500 && error.status >= 400 && error.status !== 401 && error.status !== 404) {
      Swal.fire("Solicitud incorrecta", error.error.message, 'warning')
    }
    return throwError(() => error);
  }



}

