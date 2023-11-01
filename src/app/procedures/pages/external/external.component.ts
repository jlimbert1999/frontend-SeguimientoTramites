import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ExternalDialogComponent } from '../../dialogs/external-dialog/external-dialog.component';
import { createExternalRouteMap, createTicket } from '../../helpers';
import { SendDialogComponent } from 'src/app/communication/dialogs/send-dialog/send-dialog.component';
import { sendDetail } from 'src/app/communication/interfaces';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { ExternalProcedure } from '../../models';
import { external, groupProcedure, stateProcedure } from '../../interfaces';
import { ArchiveService, ExternalService, ProcedureService } from '../../services';
import { EventProcedureDto } from '../../dtos';
import { AlertManager } from 'src/app/shared/helpers/alerts';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss'],
})
export class ExternalComponent implements OnInit {
  dataSource: external[] = [];
  displayedColumns: string[] = ['code', 'reference', 'applicant', 'state', 'startDate', 'send', 'menu-options'];
  stateProcedure: stateProcedure;
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
    const subscription: Observable<{ procedures: external[]; length: number }> = this.paginatorService.isSearchMode
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
    const dialogRef = this.dialog.open(ExternalDialogComponent, {
      width: '1000px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: external) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop();
        }
        this.dataSource = [result, ...this.dataSource];
        this.Send(result);
      }
    });
  }

  Edit(procedure: external) {
    const dialogRef = this.dialog.open(ExternalDialogComponent, {
      width: '1000px',
      data: procedure,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: external) => {
      if (result) {
        const indexFound = this.dataSource.findIndex((element) => element._id === procedure._id);
        this.dataSource[indexFound] = result;
        this.dataSource = [...this.dataSource];
      }
    });
  }

  Send(procedure: external) {
    const { _id, code, amount } = procedure;
    const data: sendDetail = {
      attachmentQuantity: amount,
      procedure: {
        _id,
        code,
      },
    };
    const dialogRef = this.dialog.open(SendDialogComponent, {
      width: '1200px',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: external) => {
      if (result) {
        const indexFound = this.dataSource.findIndex((element) => element._id === procedure._id);
        this.dataSource[indexFound].send = true;
        this.dataSource = [...this.dataSource];
      }
    });
  }

  generateRouteMap(id_procedure: string, group: groupProcedure) {
    this.procedureService.getFullProcedure(id_procedure, group).subscribe((data) => {
      createExternalRouteMap(data.procedure as ExternalProcedure, data.workflow);
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
        this.archiveService.archiveProcedure(procedure._id, archive).subscribe(() => {
          const indexFound = this.dataSource.findIndex((element) => element._id === procedure._id);
          this.dataSource[indexFound].state = stateProcedure.CONCLUIDO;
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
    this.router.navigate([`/tramites`, 'externos', procedure._id], {
      queryParams: params,
    });
  }
}
