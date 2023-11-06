import Swal from 'sweetalert2';

export class AlertManager {
  static showConfirmAlert(title: string, text: string, placeholder: string, callback: (result: string) => void) {
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
  static showQuestionAlert(title: string, subtitle: string, callback: () => void) {
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

  static showSuccesAltert(title: string, subtitle: string, timer?: number) {
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
  static showLoadingAlert(title: string, subtitle: string) {
    Swal.fire({
      title,
      text: subtitle,
      allowOutsideClick: false,
    });
    Swal.showLoading();
  }
  static closeLoadingAlert() {
    Swal.close();
  }

  static showSuccesToast(timer: number, message: string) {
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
