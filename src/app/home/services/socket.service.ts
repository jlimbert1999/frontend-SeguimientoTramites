import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client'
import { AuthService } from 'src/app/auth/services/auth.service';
import { BandejaEntradaData } from 'src/app/Bandejas/models/mail.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket;
  OnlineUsers: { id_cuenta: string, fullname: string, jobtitle: string, socketIds: string[] }[] = []
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
 
  listenNotifications() {
    return new Observable((observable) => {
      this.socket.on('notify', (data: any) => {
        observable.next(data)
      })
    })
  }
  listenMails() {
    return new Observable<BandejaEntradaData>((observable) => {
      this.socket.on('newmail', (data: BandejaEntradaData) => {
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