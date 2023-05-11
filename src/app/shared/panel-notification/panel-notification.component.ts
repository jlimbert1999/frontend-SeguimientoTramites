import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-panel-notification',
  templateUrl: './panel-notification.component.html',
  styleUrls: ['./panel-notification.component.scss']
})
export class PanelNotificationComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  
  ) { }

  ngOnInit(): void {
  }

}
