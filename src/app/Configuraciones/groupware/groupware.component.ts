import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/Tramites/services/socket.service';

@Component({
  selector: 'app-groupware',
  templateUrl: './groupware.component.html',
  styleUrls: ['./groupware.component.css']
})
export class GroupwareComponent implements OnInit {
  constructor(public socketService: SocketService) {
  }

  ngOnInit(): void {
    // this.socketService.getSocketUsers()
  }
  sendNotificacion(user: any) {
    this.socketService.socket.emit('notification', { id_cuenta: user.id_cuenta, message: 'hola' })
  }

  
  kickUser(user:any){
    this.socketService.socket.emit('expel', user.id_cuenta)
  }

}
