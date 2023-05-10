import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client'
import { userSocket } from 'src/app/auth/models/account.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Entrada } from 'src/app/Bandejas/models/entrada.interface';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket;
  onlineUsers: userSocket[] = []
  constructor() { }
  setupSocketConnection(token: string) {
    this.socket = io(environment.base_url, { auth: { token } });
  }
  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners()
      this.socket.disconnect();
    }
  }
  listenUserConection(): Observable<userSocket[]> {
    return new Observable((observable) => {
      this.socket.on('listar', data => {
        observable.next(data)
      })
    })
  }

  listenNotifications() {
    return new Observable((observable) => {
      this.socket.on('notify', (data: any) => {
        console.log(data)
        observable.next(data)
      })
    })
  }
  listenMails(): Observable<Entrada> {
    return new Observable<Entrada>((observable) => {
      this.socket.on('newmail', (data: Entrada) => {
        observable.next(data)
      })
    })
  }
  listenCancelMail(): Observable<Entrada> {
    return new Observable((observable) => {
      this.socket.on('cancelmail', data => {
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

}