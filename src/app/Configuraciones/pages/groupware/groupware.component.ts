import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/home/services/socket.service';

@Component({
  selector: 'app-groupware',
  templateUrl: './groupware.component.html',
  styleUrls: ['./groupware.component.css']
})
export class GroupwareComponent implements OnInit {
  constructor(public socketService: SocketService) {
  }

  ngOnInit(): void {
    console.log(this.socketService.OnlineUsers);
    // console.log()
    // this.socketService.getSocketUsers()
  }
  sendNotificacion(user: any) {
    this.socketService.socket.emit('notification', { id_cuenta: user.id_cuenta, fullname:'Administrador', message:'Prueba de notifiacion' })
  }

  
  kickUser(user:any){
    this.socketService.socket.emit('expel', user.id_cuenta)
  }

}
