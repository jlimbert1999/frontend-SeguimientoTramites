import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolDialogComponent } from '../../dialogs/rol-dialog/rol-dialog.component';
import { RolService } from '../../services/rol.service';
import { role } from '../../interfaces/role.interface';
import { PaginatorService } from 'src/app/shared/services';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ['rol', 'privilegios', 'opciones'];
  dataSource = signal<role[]>([]);

  constructor(public dialog: MatDialog, private rolService: RolService, private paginatorService: PaginatorService) {}
  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.rolService.get(this.paginatorService.PaginationParams).subscribe((resp) => {
      this.dataSource.set(resp.roles);
      this.paginatorService.length = resp.length;
    });
  }
  add(): void {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      width: '1200px',
    });
    dialogRef.afterClosed().subscribe((result?: role) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.paginatorService.length++;
    });
  }
  edit(role: role) {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      data: role,
      width: '1200px',
    });
    dialogRef.afterClosed().subscribe((result: role) => {
      if (!result) return;
      this.dataSource.update((values) => {
        const index = values.findIndex((value) => value._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }
}
