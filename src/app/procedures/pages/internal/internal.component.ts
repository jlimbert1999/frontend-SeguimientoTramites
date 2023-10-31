import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { InternalDialogComponent } from '../../dialogs/internal-dialog/internal-dialog.component';
import { createInternalRouteMap } from '../../helpers/internal-route-map';
import { SendDialogComponent } from 'src/app/communication/dialogs/send-dialog/send-dialog.component';
import { sendDetail } from 'src/app/communication/interfaces';
import { groupProcedure, internal, stateProcedure } from '../../interfaces';
import { InternalProcedure } from '../../models';
import { ArchiveService, InternalService, ProcedureService } from '../../services';
import { AlertManager } from 'src/app/shared/helpers/alerts';
import { EventProcedureDto } from '../../dtos';

@Component({
  selector: 'app-internal',
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.component.scss'],
})
export class InternalComponent implements OnInit {
  displayedColumns: string[] = ['alterno', 'detalle', 'destinatario', 'estado', 'fecha', 'enviado', 'opciones'];
  dataSource: internal[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private internoService: InternalService,
    public procedureService: ProcedureService,
    public paginatorService: PaginatorService,
    private archiveService: ArchiveService
  ) {}

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    const subscription: Observable<{ procedures: internal[]; length: number }> = this.paginatorService.isSearchMode
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

  Add() {
    const dialogRef = this.dialog.open(InternalDialogComponent, {
      width: '1000px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: internal) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop();
        }
        this.dataSource = [result, ...this.dataSource];
        this.paginatorService.length++;
      }
    });
  }
  Edit(tramite: internal) {
    const dialogRef = this.dialog.open(InternalDialogComponent, {
      width: '1000px',
      disableClose: true,
      data: tramite,
    });
    dialogRef.afterClosed().subscribe((result: internal) => {
      if (result) {
        const indexFound = this.dataSource.findIndex((element) => element._id === result._id);
        this.dataSource[indexFound] = result;
        this.dataSource = [...this.dataSource];
      }
    });
  }
  Send(procedure: internal) {
    const data: sendDetail = {
      attachmentQuantity: procedure.amount,
      procedure: {
        _id: procedure._id,
        code: procedure.code,
      },
    };
    const dialogRef = this.dialog.open(SendDialogComponent, {
      width: '1200px',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: internal) => {
      if (result) {
        const indexFound = this.dataSource.findIndex((element) => element._id === procedure._id);
        this.dataSource[indexFound].send = true;
        this.dataSource = [...this.dataSource];
      }
    });
  }
  generateRouteMap(id_tramite: string, group: groupProcedure) {
    this.procedureService.getFullProcedure(id_tramite, group).subscribe((data) => {
      createInternalRouteMap(data.procedure as InternalProcedure, data.workflow);
    });
  }

  conclude(procedure: internal) {
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
  showDetails(procedure: internal) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
      ...(this.paginatorService.searchMode && { search: true }),
    };
    this.router.navigate(['/tramites/internos', procedure._id], {
      queryParams: params,
    });
  }
}
