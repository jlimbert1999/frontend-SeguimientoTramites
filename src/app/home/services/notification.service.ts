import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

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

  addNotificationNewMail(user: { nombre: string, paterno: string, materno: string }, total_mails: number) {
    this.number_mails.next(total_mails)
    let fullname = `${user.nombre} ${user.paterno} ${user.materno}`
    let toast = this.toastr.info(`${fullname} ha enviado un tramite`, "Nuevo tramite recibido", {
      positionClass: 'toast-bottom-right',
      timeOut: 7000,
    })
    toast.onTap.subscribe((action: any) => {
      this.router.navigateByUrl('home/bandeja-entrada')
    })
    this.list.unshift({
      text: `${fullname} ha enviado un nuevo tramite`,
      type: 'message'
    })
    this.notificacions.next(this.list)
  }

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