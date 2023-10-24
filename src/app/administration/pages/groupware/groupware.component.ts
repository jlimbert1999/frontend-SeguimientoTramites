import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { userSocket } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-groupware',
  templateUrl: './groupware.component.html',
  styleUrls: ['./groupware.component.scss'],
})
export class GroupwareComponent implements OnInit {
  textSearch: string = '';
  constructor(
    public socketService: SocketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
  sendNotificacion(user: userSocket) {
    Swal.fire({
      icon: 'info',
      title: `Enviar notificacion a ${user.officer.fullname}`,
      text: `Ingrese una descripcion`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      customClass: {
        validationMessage: 'my-validation-message',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar una descripcion'
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.socketService.sendNotificationToUser(
          user.id_account,
          result.value!
        );
      }
    });
  }

  kickUser(user: userSocket) {
    Swal.fire({
      icon: 'info',
      title: `Expulsar al funcionario ${user.officer.fullname}`,
      text: `Ingrese un motivo`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.socketService.sendNotificacionToExpelUser(
          user.id_account,
          result.value!
        );
      }
    });
  }
}
