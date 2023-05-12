import Swal from "sweetalert2";

export function showLoadingRequest() {
    Swal.fire({
        title: 'Guardando....',
        text: 'Por favor espere',
        allowOutsideClick: false,
    });
    Swal.showLoading()
}
export function closeLoadingRequets(message: string) {
    Swal.close();
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 3000,
        showCloseButton: true,
        timerProgressBar: true,

    })
    Toast.fire({
        icon: 'success',
        title: message,
    })
}