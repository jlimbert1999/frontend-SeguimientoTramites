import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface ToastOptions {
  seconds?: number;
  title: string;
  message: string;
  onActionRouteNavigate: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toast: ToastrService, private router: Router) {}

  showToast({ seconds = 5000, title, message, onActionRouteNavigate }: ToastOptions) {
    const toast = this.toast.info(message, title, {
      positionClass: 'toast-bottom-right',
      closeButton: true,
      timeOut: seconds,
    });
    toast.onTap.subscribe(() => {
      this.router.navigateByUrl(onActionRouteNavigate);
    });
  }
}
