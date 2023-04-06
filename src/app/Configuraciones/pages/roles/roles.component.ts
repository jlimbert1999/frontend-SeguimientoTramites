import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolDialogComponent } from '../../dialogs/rol-dialog/rol-dialog.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {
  displayedColumns: string[] = ['position', 'nombre', 'privilegios', 'opciones'];
  dataSource: any[] = [];
  constructor(public dialog: MatDialog) {

  }
  Add(): void {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      width:'1000px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
