import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SendDialogComponent } from 'src/app/communication/dialogs/send-dialog/send-dialog.component';
import { RegisterInternalComponent } from '../register-internal/register-internal.component';

import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { ArchiveService, InternalService, ProcedureService } from '../../services';

import { createRouteMap } from '../../helpers';

import { EventProcedureDto } from '../../dtos';
import { InternalProcedure } from '../../models';
import { groupProcedure, internal, stateProcedure } from '../../interfaces';
import { TransferDetails } from 'src/app/communication/interfaces';
import { AlertService } from 'src/app/shared/services';

@Component({
  selector: 'app-internal',
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.component.scss'],
})
export class InternalComponent implements OnInit {
  displayedColumns: string[] = ['code', 'reference', 'applicant', 'state', 'startDate', 'send', 'menu-options'];
  dataSource: InternalProcedure[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private internoService: InternalService,
    public procedureService: ProcedureService,
    public paginatorService: PaginatorService,
    private alertService: AlertService,
    private archiveService: ArchiveService
  ) {}

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    const subscription: Observable<{ procedures: InternalProcedure[]; length: number }> = this.paginatorService
      .isSearchMode
      ? this.internoService.search(
          this.paginatorService.searchParams.get('text')!,
          this.paginatorService.limit,
          this.paginatorService.offset
        )
      : this.internoService.findAll(this.paginatorService.limit, this.paginatorService.offset);
    subscription.subscribe((data) => {
      this.dataSource = data.procedures;
      this.paginatorService.length = data.length;
    });
  }

  add() {
    const dialogRef = this.dialog.open<RegisterInternalComponent, undefined, InternalProcedure>(
      RegisterInternalComponent,
      {
        width: '1000px',
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((createdProcedure) => {
      if (createdProcedure) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop();
        }
        this.dataSource = [createdProcedure, ...this.dataSource];
        this.paginatorService.length++;
        this.send(createdProcedure);
      }
    });
  }
  edit(tramite: InternalProcedure) {
    const dialogRef = this.dialog.open<RegisterInternalComponent, InternalProcedure, InternalProcedure>(
      RegisterInternalComponent,
      {
        width: '1000px',
        disableClose: true,
        data: tramite,
      }
    );
    dialogRef.afterClosed().subscribe((updatedProcedure) => {
      if (updatedProcedure) {
        const indexFound = this.dataSource.findIndex((element) => element._id === updatedProcedure._id);
        this.dataSource[indexFound] = updatedProcedure;
        this.dataSource = [...this.dataSource];
        this.alertService.showSuccesToast({ title: 'Tramite' });
      }
    });
  }
  send(procedure: InternalProcedure) {
    const dialogRef = this.dialog.open<SendDialogComponent, TransferDetails, string>(SendDialogComponent, {
      width: '1200px',
      data: {
        id_procedure: procedure._id,
        code: procedure.code,
        attachmentQuantity: procedure.amount,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((message) => {
      if (message) {
        const indexFound = this.dataSource.findIndex((element) => element._id === procedure._id);
        this.dataSource[indexFound].isSend = true;
        this.dataSource = [...this.dataSource];
      }
    });
  }
  generateRouteMap(id_tramite: string, group: groupProcedure) {
    this.procedureService.getFullProcedure(id_tramite, group).subscribe((data) => {
      // createRouteMap(data.procedure, data.workflow);
    });
  }

  conclude(procedure: internal) {
    this.alertService.showConfirmAlert(
      `¿Concluir el tramite ${procedure.code}?`,
      'Los tramites concluidos desde su administacion no pueden ser desarchivados',
      'Ingrese una referencia para concluir',
      (description) => {
        const archive: EventProcedureDto = {
          procedure: procedure._id,
          description,
          stateProcedure: stateProcedure.CONCLUIDO,
        };
        this.archiveService.archiveProcedure(archive).subscribe((data) => {
          const indexFound = this.dataSource.findIndex((element) => element._id === procedure._id);
          this.dataSource[indexFound].state = stateProcedure.CONCLUIDO;
          this.alertService.showSuccesToast({ title: 'Tramite' });
        });
      }
    );
  }
  showDetails(procedure: internal) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
      ...(this.paginatorService.searchMode && { search: true }),
    };
    this.router.navigate(['tramites/internos', procedure.group, procedure._id], {
      queryParams: params,
    });
  }
}
