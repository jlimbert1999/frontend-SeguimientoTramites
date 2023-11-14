import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { SendDialogComponent } from 'src/app/communication/dialogs/send-dialog/send-dialog.component';
import { ExternalDialogComponent } from '../../dialogs/external-dialog/external-dialog.component';

import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { ArchiveService, ExternalService, ProcedureService } from '../../services';

import { AlertManager } from 'src/app/shared/helpers/alerts';
import { EnumToString, createRouteMap, createTicket } from '../../helpers';

import { ProcedureTransferDetails } from 'src/app/communication/models/procedure-transfer-datais.mode';
import { ExternalProcedure } from '../../models';
import { EventProcedureDto } from '../../dtos';
import { external, groupProcedure, stateProcedure } from '../../interfaces';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss'],
})
export class ExternalComponent implements OnInit {
  dataSource: ExternalProcedure[] = [];
  displayedColumns: string[] = ['code', 'reference', 'applicant', 'state', 'startDate', 'send', 'menu-options'];
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private readonly externalService: ExternalService,
    private readonly procedureService: ProcedureService,
    private readonly paginatorService: PaginatorService,
    private readonly archiveService: ArchiveService
  ) {}
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const subscription: Observable<{ procedures: ExternalProcedure[]; length: number }> = this.paginatorService
      .isSearchMode
      ? this.externalService.search(
          this.paginatorService.searchParams.get('text')!,
          this.paginatorService.limit,
          this.paginatorService.offset
        )
      : this.externalService.findAll(this.paginatorService.limit, this.paginatorService.offset);
    subscription.subscribe((data) => {
      this.dataSource = data.procedures;
      this.paginatorService.length = data.length;
    });
  }

  add() {
    const dialogRef = this.dialog.open<ExternalDialogComponent, undefined, ExternalProcedure>(ExternalDialogComponent, {
      width: '1000px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((createdProcedure) => {
      if (createdProcedure) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop();
        }
        this.dataSource = [createdProcedure, ...this.dataSource];
        this.send(createdProcedure);
      }
    });
  }

  edit(procedure: ExternalProcedure) {
    const dialogRef = this.dialog.open<ExternalDialogComponent, ExternalProcedure, ExternalProcedure>(
      ExternalDialogComponent,
      {
        width: '1000px',
        data: procedure,
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((updatedProcedure) => {
      if (updatedProcedure) {
        const indexFound = this.dataSource.findIndex((element) => element._id === procedure._id);
        this.dataSource[indexFound] = updatedProcedure;
        this.dataSource = [...this.dataSource];
      }
    });
  }

  send(procedure: ExternalProcedure) {
    const dialogRef = this.dialog.open<SendDialogComponent, ProcedureTransferDetails, string>(SendDialogComponent, {
      width: '1200px',
      data: ProcedureTransferDetails.fromfirstSend(procedure),
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

  generateRouteMap(id_procedure: string, group: groupProcedure) {
    this.procedureService.getFullProcedure(id_procedure, group).subscribe((data) => {
      createRouteMap(data.procedure, data.workflow);
    });
  }

  generateTicket(tramite: external) {
    createTicket(tramite);
  }

  conclude(procedure: external) {
    AlertManager.showConfirmAlert(
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
          AlertManager.showSuccesToast(3000, data.message);
        });
      }
    );
  }

  showDetails(procedure: external) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
      ...(this.paginatorService.searchMode && { search: true }),
    };
    this.router.navigate([`tramites`, EnumToString(procedure.group), procedure._id], {
      queryParams: params,
    });
  }
}
