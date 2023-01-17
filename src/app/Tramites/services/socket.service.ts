import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client'
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { BandejaEntradaData } from '../models/mail.model';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket;
  OnlineUsers: any[] = []
  constructor() { }
  setupSocketConnection(account: any) {
    this.socket = io(environment.base_url, { auth: { token: account } });
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  listenUserConected() {
    return new Observable((observable) => {
      this.socket.on('listar', (data: any) => {
        observable.next(data)
      })
    })
  }
  SocketOn_Mails() {
    return new Observable((observable) => {
      this.socket.on('recibir_tramite', (data: any) => {
        observable.next(data)
      })
    })
  }
  listenNotifications() {
    return new Observable((observable) => {
      this.socket.on('notify', (data: any) => {
        observable.next(data)
      })
    })
  }
  listenMails() {
    return new Observable((observable) => {
      this.socket.on('newmail', (data: any) => {
        observable.next(data)
      })
    })
  }
  expelUser() {
    return new Observable((observable) => {
      this.socket.on('kick', (message: any) => {
        observable.next(message)
      })
    })
  }

}
