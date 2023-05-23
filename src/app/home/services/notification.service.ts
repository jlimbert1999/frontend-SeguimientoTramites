import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  number_mails = new BehaviorSubject<number>(0)
  number_mails$ = this.number_mails.asObservable()

  list: any[] = []
  notificacions = new BehaviorSubject<any[]>([])
  notificacions$ = this.notificacions.asObservable()


  constructor(private toastr: ToastrService, private router: Router) { }

  showNotificationPendingMails(numberMails: number) {
    this.number_mails.next(numberMails)
    if (numberMails === 0) return
    const toast = this.toastr.warning('Revise su bandeja de entrada', `Tramites pendientes: ${numberMails}`, {
      positionClass: 'toast-bottom-right',
      timeOut: 7000,
    })
    toast.onTap.subscribe(action => {
      this.router.navigateByUrl('home/bandejas/entrada')
    })
  }
  showNotificationNewMail(user: { nombre: string, paterno: string, materno: string }) {
    this.number_mails.next(this.number_mails.value + 1)
    const toast = this.toastr.info(`${user.nombre} ${user.paterno} ${user.materno} ha enviado un tramite`, "Nuevo tramite recibido", {
      positionClass: 'toast-bottom-right',
      timeOut: 7000,
    })
    toast.onTap.subscribe(action => {
      this.router.navigateByUrl('home/bandejas/entrada')
    })
  }
}