import { Component, OnInit } from '@angular/core';
import { userSocket } from 'src/app/auth/models/account.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SocketService } from 'src/app/home/services/socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-groupware',
  templateUrl: './groupware.component.html',
  styleUrls: ['./groupware.component.css']
})
export class GroupwareComponent implements OnInit {
  constructor(public socketService: SocketService, private authService: AuthService) {
  }

  ngOnInit(): void {
  }
  sendNotificacion(user: userSocket) {
    Swal.fire({
      icon: 'info',
      title: `Enviar notificacion a ${user.funcionario.nombre}`,
      text: `Ingrese una descripcion`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar una descripcion'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.socketService.sendNotificationToUser(user.id_cuenta, result.value!)
      }
    })

  }


  kickUser(user: userSocket) {
    Swal.fire({
      icon: 'info',
      title: `Expulsar al funcionario ${user.funcionario.nombre}`,
      text: `Ingrese un motivo`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.socketService.sendNotificacionToExpelUser(user.id_cuenta, result.value!)
      }
    })
  }

}
