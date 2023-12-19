import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  showConfirmAlert(title: string, text: string, placeholder: string, callback: (result: string) => void) {
    Swal.fire({
      icon: 'question',
      title,
      text,
      input: 'textarea',
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('<i class="fa fa-info-circle"></i> Ingrese una descripcion para continuar.');
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        callback(result.value);
      }
    });
  }
  showQuestionAlert(title: string, subtitle: string, callback: () => void) {
    Swal.fire({
      title,
      text: subtitle,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }

  showSuccesAltert(title: string, subtitle: string, timer?: number) {
    Swal.fire({
      icon: 'success',
      title,
      text: subtitle,
      timer,
      confirmButtonText: 'Aceptar',
      willClose: () => {
        console.log('cerado');
        clearInterval(timer);
      },
    });
  }
  showLoadingAlert(title: string, subtitle: string) {
    Swal.fire({
      title,
      text: subtitle,
      allowOutsideClick: false,
    });
    Swal.showLoading();
  }
  closeLoadingAlert() {
    Swal.close();
  }

  showSuccesToast(timer: number = 3000, message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: 'success',
      title: message,
    });
  }
}
