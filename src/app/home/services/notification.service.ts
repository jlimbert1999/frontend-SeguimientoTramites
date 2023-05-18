import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  number_mails = new BehaviorSubject<string>('0')
  number_mails$ = this.number_mails.asObservable()

  list: any[] = []
  notificacions = new BehaviorSubject<any[]>([])
  notificacions$ = this.notificacions.asObservable()


  constructor(private toastr: ToastrService, private router: Router) { }

  addNotificationEvent(text: string, title: string) {
    let toast = this.toastr.warning(text, title, {
      positionClass: 'toast-bottom-right',
      timeOut: 7000,
    })
    toast.onTap.subscribe((action: any) => {
      this.router.navigateByUrl('home/bandeja-entrada')
    })
    this.list.unshift({
      text: `Tramites pendientes encontrados, revisar bandeja de entrada`,
      type: 'message'
    })
    this.notificacions.next(this.list)
  }
  showNotificationWarning(text: string, title: string) {
    const toast = this.toastr.warning(text, title, {
      positionClass: 'toast-bottom-right',
      timeOut: 7000,
    })
    toast.onTap.subscribe((action: any) => {
      this.router.navigateByUrl('home/bandeja-entrada')
    })
    this.list.unshift({
      text: `Tramites pendientes encontrados, revisar bandeja de entrada`,
      type: 'message'
    })
  }
  showNotificationPendingMails(numberMails: number) {
    numberMails > 99 ? this.number_mails.next('99') : this.number_mails.next(numberMails.toString())
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
    const toast = this.toastr.info(`${user.nombre} ${user.paterno} ${user.materno} ha enviado un tramite`, "Nuevo tramite recibido", {
      positionClass: 'toast-bottom-right',
      timeOut: 7000,
    })
    toast.onTap.subscribe(action => {
      this.router.navigateByUrl('home/bandejas/entrada')
    })
  }
}