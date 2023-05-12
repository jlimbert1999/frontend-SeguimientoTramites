import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notificacions',
  templateUrl: './notificacions.component.html',
  styleUrls: ['./notificacions.component.scss']
})
export class NotificacionsComponent {


  constructor(private notificationService: NotificationService) {

  }
  list: any = this.notificationService.notificacions$

}
