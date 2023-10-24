import Swal from 'sweetalert2';

export class SweetAlertManager {
  static showConfirmAlert(
    callback: (result: string) => void,
    title: string,
    text: string,
    placeholder: string
  ) {
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
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Ingrese una descripcion para continuar.'
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        callback(result.value);
      }
    });
  }
}
