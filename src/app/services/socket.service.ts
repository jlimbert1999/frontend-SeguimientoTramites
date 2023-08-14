import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client'
import { userSocket } from 'src/app/auth/models/account.model';
import { environment } from 'src/environments/environment';
import { inbox } from '../communication/interfaces';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket;
  isOnline: boolean = false
  private onlineUsersSubject: BehaviorSubject<userSocket[]> = new BehaviorSubject<userSocket[]>([]);
  public onlineUsers$: Observable<userSocket[]> = this.onlineUsersSubject.asObservable();
  constructor() { }
  setupSocketConnection(token: string) {
    this.socket = io(`${environment.base_url}`, { auth: { token } });
  }
  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners()
      this.socket.disconnect();
      this.isOnline = false
    }
  }
  listenUserConection() {
    this.socket.on('listar', data => {
      this.onlineUsersSubject.next(data)
    })
  }
  listenMails(): Observable<inbox> {
    return new Observable<inbox>((observable) => {
      this.socket.on('newmail', (data: inbox) => {
        observable.next(data)
      })
    })
  }
  listenNotifications() {
    return new Observable((observable) => {
      this.socket.on('notify', (data: any) => {
        alert(data)
        observable.next(data)
      })
    })
  }

  listenCancelMail(): Observable<null> {
    return new Observable((observable) => {
      this.socket.on('cancel-mail', (data: null) => {
        observable.next(data)
      })
    })
  }
  listenExpel(): Observable<string> {
    return new Observable((observable) => {
      this.socket.on('kick', (message: string | undefined) => {
        if (!message) {
          message = ''
        }
        observable.next(message)
      })
    })
  }
  sendNotificationToUser(id_accountReceiver: string, message: string) {
    this.socket.emit('notification', { id_cuenta: id_accountReceiver, message })
  }
  sendNotificacionToExpelUser(id_accountReceiver: string, message: string) {
    this.socket.emit('expel', { id_cuenta: id_accountReceiver, message })
  }

  // sendMail(mails: inbox[]) {
  //   this.socket.emit('mail', mails)
  // }

  emitCancelAllMails(ids_receivers: string[]) {
    this.socket.emit('mail-all-cancel', ids_receivers)
  }
  emitCancelMail(id_receiver: string) {
    this.socket.emit('mail-one-cancel', id_receiver)
  }

}