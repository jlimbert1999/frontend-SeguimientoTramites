import Swal, { SweetAlertIcon } from "sweetalert2"

export function showToast(icon: SweetAlertIcon, title: string, timer: number = 3000, text?: string) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
    })
    Toast.fire({
        icon: icon,
        title: title,
        text: text ? text : ''
    })
}