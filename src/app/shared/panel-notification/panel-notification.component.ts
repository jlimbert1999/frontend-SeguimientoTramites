import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { NotificationsService } from 'src/app/Tramites/services/notifications.service';

@Component({
  selector: 'app-panel-notification',
  templateUrl: './panel-notification.component.html',
  styleUrls: ['./panel-notification.component.css']
})
export class PanelNotificationComponent implements OnInit {
  list = this.notificationService.notificacions$
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public notificationService: NotificationsService
  ) { }

  ngOnInit(): void {
  }

}
