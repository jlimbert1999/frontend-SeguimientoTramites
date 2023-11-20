import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { communication } from '../communication/interfaces/communication';
import { userSocket } from '../auth/interfaces';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;
  isOnline: boolean = false;
  // public onlineUsers = signal<userSocket[]>([]);
  private onlineUsersSubject: BehaviorSubject<userSocket[]> = new BehaviorSubject<userSocket[]>([]);
  public onlineUsers$: Observable<userSocket[]> = this.onlineUsersSubject.asObservable();

  private mailSubscription: Subject<communication> = new Subject();
  public mailSubscription$: Observable<communication> = this.mailSubscription.asObservable();

  constructor() {
    this.setupSocketConnection(localStorage.getItem('token') ?? '');
  }
  setupSocketConnection(token: string) {
    this.socket = io(`${environment.base_url}`, { auth: { token } });
  }
  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.isOnline = false;
    }
  }
  listenUserConection() {
    this.socket.on('listar', (data) => {
      // this.onlineUsers.set(data);
      this.onlineUsersSubject.next(data);
    });
  }
  listenMails() {
    this.socket.on('new-mail', (data: communication) => {
      this.mailSubscription.next(data);
    });
  }
  listenCancelMail(): Observable<string> {
    return new Observable((observable) => {
      this.socket.on('cancel-mail', (id_mail: string) => {
        observable.next(id_mail);
      });
    });
  }
  listenUnarchives(): Observable<string> {
    return new Observable((observable) => {
      this.socket.on('unarchive-mail', (id_mail: string) => {
        observable.next(id_mail);
      });
    });
  }

  listenNotifications() {
    return new Observable((observable) => {
      this.socket.on('notify', (data: any) => {
        alert(data);
        observable.next(data);
      });
    });
  }

  listenExpel(): Observable<string> {
    return new Observable((observable) => {
      this.socket.on('kick', (message: string | undefined) => {
        if (!message) {
          message = '';
        }
        observable.next(message);
      });
    });
  }
  sendNotificationToUser(id_accountReceiver: string, message: string) {
    this.socket.emit('notification', {
      id_cuenta: id_accountReceiver,
      message,
    });
  }
  sendNotificacionToExpelUser(id_accountReceiver: string, message: string) {
    this.socket.emit('expel', { id_cuenta: id_accountReceiver, message });
  }

  // sendMail(mails: inbox[]) {
  //   this.socket.emit('mail', mails)
  // }

  emitCancelAllMails(ids_receivers: string[]) {
    this.socket.emit('mail-all-cancel', ids_receivers);
  }
  emitCancelMail(id_receiver: string) {
    this.socket.emit('mail-one-cancel', id_receiver);
  }
}
