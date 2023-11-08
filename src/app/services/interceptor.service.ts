import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { LoaderService } from '../auth/services/loader.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {
  constructor(private loadingService: LoaderService, private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`);
    const reqClone = req.clone({
      headers,
    });
    this.loadingService.show();
    return next.handle(reqClone).pipe(
      catchError((Error: HttpErrorResponse) => {
        console.log('new Error', Error);
        this.handleErrors(Error);
        return throwError(() => Error);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }

  handleErrors(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.router.navigate(['/login']);
    } else if (error.status === 403) {
      Swal.fire(
        'Sin autorizacion',
        'Esta cuenta no tiene los permisos necesarios para realizar esta accion',
        'warning'
      );
    } else if (error.status === 404) {
      Swal.fire({
        title: 'El recurso solicitado no existe',
        text: error.error.message,
        icon: 'info',
        confirmButtonText: 'Aceptar',
      });
    } else if (error.status >= 500) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: 'La operacion no se pudo completar',
        confirmButtonText: 'Aceptar',
      });
    } else if (error.status < 500 && error.status >= 400 && error.status !== 401 && error.status !== 404) {
      Swal.fire({
        title: 'Solicitud incorrecta',
        text: error.error.message,
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
    }
    return throwError(() => error);
  }
}
