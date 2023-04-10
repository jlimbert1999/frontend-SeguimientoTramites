import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolDialogComponent } from '../../dialogs/rol-dialog/rol-dialog.component';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../models/rol.model';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  animations:[
    fadeInOnEnterAnimation(),
  ]
})
export class RolesComponent {
  displayedColumns: string[] = ['position', 'rol', 'privilegios', 'opciones'];
  dataSource: Rol[] = [];

  constructor(public dialog: MatDialog, private rolService: RolService) {
    this.rolService.get().subscribe(data => {
      this.dataSource = data
    })
  }
  Add(): void {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      width: '1000px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = [result, ...this.dataSource]
      }
    });
  }
  Edit(Rol: Rol) {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      width: '1000px',
      data: Rol
    });
    dialogRef.afterClosed().subscribe((result: Rol) => {
      if (result) {
        this.dataSource = this.dataSource.map(element => {
          if (element._id === result._id) {
            element = result
          }
          return element
        })
      }
    });
  }
}
