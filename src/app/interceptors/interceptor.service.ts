import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
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
    private router: Router,
    private loadingService: LoaderService
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
      catchError(this.manejoErrores),
      finalize(() => this.loadingService.hide())
    )
  }
  manejoErrores(error: HttpErrorResponse) {
    if (error.status === 401) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesion expirada, vuelva a iniciar sesion'
      })
      // this.router.navigate(['/login'])
    }
    else if (error.status === 403) {
      Swal.fire({
        icon: 'warning',
        title: 'No tiene los permisos necesarios'
      })
      // this.router.navigateByUrl('/home')
    }
    else {
      Swal.fire('error', error.error.message, 'error')
    }
    return throwError(() => error);
  }
}

