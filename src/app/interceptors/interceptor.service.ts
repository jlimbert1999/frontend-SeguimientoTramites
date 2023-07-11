import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
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
    if (req.method === 'POST' || req.method === 'PUT') {
      Swal.fire({
        title: 'Guardando....',
        text: 'Por favor espere',
        allowOutsideClick: false,
      });
      Swal.showLoading()
    }
    this.loadingService.show()
    return next.handle(reqClone).pipe(
      tap((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response && (req.method === 'POST' || req.method === 'PUT')) {
          Swal.close()
          this.showSuccesRequest()
        }
      }),
      catchError((Error: HttpErrorResponse) => {
        console.log('new Error', Error);
        Swal.close()
        this.handleErrors(Error)
        return throwError(() => Error);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    )
  }
  showSuccesRequest() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      showCloseButton: true
    })
    Toast.fire({
      icon: 'success',
      title: 'Datos guardados correctamente!'
    })
  }

  handleErrors(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.router.navigate(['/login'])
    }
    else if (error.status === 403) {
      Swal.fire("Sin autorizacion", error.error.message, 'warning')
    }
    else if (error.status === 404) {
      Swal.fire({ title: "El recurso solicitado no existe", text: error.error.message, icon: 'info', confirmButtonText: 'Aceptar' })
    }
    else if (error.status >= 500) {
      Swal.fire("Error en el sevidor", error.error.message, 'error')
    }
    else if (error.status < 500 && error.status >= 400 && error.status !== 401 && error.status !== 404) {
      Swal.fire({
        title: "Solicitud incorrecta",
        text: error.error.message,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })
    }
    return throwError(() => error);
  }



}

