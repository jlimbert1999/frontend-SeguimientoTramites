import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AppearanceService } from './appearance.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {
  constructor(private router: Router, private appearanceService: AppearanceService, private dialogRef: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`);
    const reqClone = req.clone({
      headers,
    });
    this.appearanceService.loading.set(true);
    return next.handle(reqClone).pipe(
      catchError((Error: HttpErrorResponse) => {
        this.handleErrors(Error);
        return throwError(() => Error);
      }),
      finalize(() => {
        this.appearanceService.loading.set(false);
      })
    );
  }

  handleErrors(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.router.navigate(['/login']);
      this.dialogRef.closeAll();
      localStorage.removeItem('token')
    } else if (error.status === 403) {
      Swal.fire('Sin autorizacion', error.error['message'], 'warning');
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
