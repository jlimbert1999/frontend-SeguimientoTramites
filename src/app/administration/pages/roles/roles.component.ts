import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolDialogComponent } from '../../dialogs/rol-dialog/rol-dialog.component';
import { RolService } from '../../services/rol.service';
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
  displayedColumns: string[] = ['rol', 'privilegios', 'opciones'];
  dataSource: role[] = [];

  constructor(
    public dialog: MatDialog,
    private rolService: RolService,
    private paginationService: PaginatorService
  ) {
    this.rolService.get(this.paginationService.limit, this.paginationService.offset).subscribe(data => {
      this.dataSource = data.roles
    })
  }
  Add(): void {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe((result: role) => {
      if (result) {
        this.dataSource = [result, ...this.dataSource]
      }
    });
  }
  Edit(role: role) {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      width: '1200px',
      data: role
    });
    dialogRef.afterClosed().subscribe((result: role) => {
      if (result) {
        const index = this.dataSource.findIndex(element => element._id === result._id);
        this.dataSource[index] = result
        this.dataSource = [...this.dataSource]
      }
    });
  }
}
