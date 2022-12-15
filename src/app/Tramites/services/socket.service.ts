import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client'
import { environment } from 'src/environments/environment';
import { BandejaEntradaData } from '../models/mail.model';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any;
  Users: any[] = []
  constructor() { }
  setupSocketConnection() {
    this.socket = io(environment.base_url);
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  SocketOn_JoinUser() {
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
}
