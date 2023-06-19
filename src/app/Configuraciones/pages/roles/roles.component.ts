import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolDialogComponent } from '../../dialogs/rol-dialog/rol-dialog.component';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../models/rol.model';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { role } from '../../interfaces/role.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
  ]
})
export class RolesComponent {
  displayedColumns: string[] = ['position', 'rol', 'privilegios', 'opciones'];
  dataSource: role[] = [];

  constructor(
    public dialog: MatDialog,
    private rolService: RolService,
    private paginationService: PaginatorService
  ) {
    this.rolService.get(this.paginationService.limit, this.paginationService.offset).subscribe(data => {
      console.log(data);
      this.dataSource = data.roles
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
  Edit(role: role) {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      width: '1000px',
      data: role
    });
    dialogRef.afterClosed().subscribe((result: Rol) => {
      // if (result) {
      //   this.dataSource = this.dataSource.map(element => {
      //     if (element._id === result._id) {
      //       element = result
      //     }
      //     return element
      //   })
      // }
    });
  }
}
