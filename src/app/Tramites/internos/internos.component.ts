import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInternosComponent } from './dialog-internos/dialog-internos.component';

@Component({
  selector: 'app-internos',
  templateUrl: './internos.component.html',
  styleUrls: ['./internos.component.css']
})
export class InternosComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  agregar_tramite() {
    const dialogRef = this.dialog.open(DialogInternosComponent, {
      width: '1000px'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }
}
