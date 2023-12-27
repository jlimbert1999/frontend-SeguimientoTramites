import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { userSocket } from '../auth/interfaces';
import { communicationResponse } from '../communication/interfaces';
import { Communication } from '../communication/models';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;
  private onlineUsersSubject: BehaviorSubject<userSocket[]> = new BehaviorSubject<userSocket[]>([]);
  public onlineUsers$ = this.onlineUsersSubject.asObservable();

  setupSocketConnection() {
    const token = localStorage.getItem('token') ?? '';
    this.socket = io(`${environment.base_url}`, { auth: { token } });
  }
  disconnect() {
    if (this.socket) {
      this.socket.removeListener();
      this.socket.disconnect();
    }
  }
  listenUserConnection() {
    this.socket.on('listar', (data: userSocket[]) => {
      this.onlineUsersSubject.next(data);
    });
  }
  listenMails(): Observable<Communication> {
    return new Observable((observable) => {
      this.socket.on('new-mail', (data: communicationResponse) => {
        observable.next(Communication.ResponseToModel(data));
      });
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

  emitCancelAllMails(ids_receivers: string[]) {
    this.socket.emit('mail-all-cancel', ids_receivers);
  }
  emitCancelMail(id_receiver: string) {
    this.socket.emit('mail-one-cancel', id_receiver);
  }
}
