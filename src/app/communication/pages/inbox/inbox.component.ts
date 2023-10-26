import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InboxService } from '../../services/inbox.service';
import { SendDialogComponent } from '../../dialogs/send-dialog/send-dialog.component';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { SocketService } from 'src/app/services/socket.service';
import { communication, sendDetail, statusMail } from '../../interfaces';
import { ProcedureService, ArchiveService } from 'src/app/procedures/services';
import { groupProcedure, stateProcedure } from 'src/app/procedures/interfaces';

import { ExternalProcedure, InternalProcedure } from 'src/app/procedures/models';
import { createExternalRouteMap, createInternalRouteMap } from 'src/app/procedures/helpers';
import { EventProcedureDto } from 'src/app/procedures/dtos';
import { AlertManager } from 'src/app/shared/helpers/alerts';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit, OnDestroy {
  private mailSubscription: Subscription;
  private mailCancelSubscription: Subscription;
  displayedColumns: string[] = ['code', 'reference', 'state', 'emitter', 'outboundDate', 'options'];
  dataSource: communication[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private archiveService: ArchiveService,
    private procedureService: ProcedureService,
    private socketService: SocketService,
    private inboxService: InboxService,
    private paginatorService: PaginatorService
  ) {
    this.listenNewMails();
    this.listenCancelMails();
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    if (this.mailSubscription) this.mailSubscription.unsubscribe();
    if (this.mailCancelSubscription) this.mailCancelSubscription.unsubscribe();
  }

  getData() {
    if (this.paginatorService.searchMode) {
      this.inboxService
        .searchInboxOfAccount(
          this.paginatorService.limit,
          this.paginatorService.offset,
          this.paginatorService.searchParams.get('text')!
        )
        .subscribe((resp) => {
          this.dataSource = resp.mails;
          this.paginatorService.length = resp.length;
        });
    } else {
      this.inboxService
        .getInboxOfAccount(this.paginatorService.limit, this.paginatorService.offset)
        .subscribe((resp) => {
          this.dataSource = resp.mails;
          this.paginatorService.length = resp.length;
        });
    }
  }

  send(mail: communication) {
    const { procedure, attachmentQuantity } = mail;
    const data: sendDetail = {
      id_mail: mail._id,
      attachmentQuantity,
      procedure: {
        _id: procedure._id,
        code: procedure.code,
      },
    };
    const dialogRef = this.dialog.open(SendDialogComponent, {
      width: '1200px',
      data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  acceptMail(mail: communication) {
    AlertManager.showQuestionAlert(
      `¿Aceptar tramite ${mail.procedure.code}?`,
      `El tramite sera marcado como aceptado`,
      () => {
        this.inboxService.acceptMail(mail._id).subscribe(
          (newState) => {
            const indexFound = this.dataSource.findIndex((item) => item._id === mail._id);
            this.dataSource[indexFound].procedure.state = newState;
            this.dataSource[indexFound].status = statusMail.Received;
          },
          () => {
            this.getData();
          }
        );
      }
    );
  }
  rejectMail(mail: communication) {
    AlertManager.showConfirmAlert(
      `¿Rechazar tramite ${mail.procedure.code}?`,
      `El tramite sera devuelto al funcionario emisor`,
      'Ingrese el motivo del rechazo',
      (description) => {
        this.inboxService.rejectMail(mail._id, description).subscribe((message) => {
          this.getData();
        });
      }
    );
  }
  conclude(mail: communication, isSuspended: boolean) {
    AlertManager.showConfirmAlert(
      `¿${isSuspended ? 'Suspender' : 'Concluir'} el tramite ${mail.procedure.code}?`,
      `El tramite pasara a su seccion de archivos`,
      'Ingrese una referencia para concluir',
      (description) => {
        const archiveDto: EventProcedureDto = {
          description,
          procedure: mail.procedure._id,
          stateProcedure: isSuspended ? stateProcedure.SUSPENDIDO : stateProcedure.CONCLUIDO,
        };
        this.archiveService.archiveMail(mail._id, archiveDto).subscribe(() => {
          this.getData();
        });
      }
    );
  }
  generateRouteMap(mail: communication) {
    this.procedureService.getFullProcedure(mail.procedure._id).subscribe((data) => {
      const { procedure, workflow } = data;
      switch (procedure.group) {
        case groupProcedure.EXTERNAL:
          createExternalRouteMap(procedure as ExternalProcedure, workflow);
          break;
        case groupProcedure.INTERNAL:
          createInternalRouteMap(procedure as InternalProcedure, workflow);
          break;
        default:
          alert('Group procedure is not defined');
          break;
      }
    });
  }
  showDetail(mail: communication) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
      ...(this.paginatorService.searchMode && { search: true }),
    };
    this.router.navigate(['bandejas/entrada', mail._id], {
      queryParams: params,
    });
  }

  listenNewMails() {
    this.mailSubscription = this.socketService.mailSubscription$.subscribe((data) => {
      if (this.paginatorService.limit === this.dataSource.length) this.dataSource.pop();
      this.dataSource = [data, ...this.dataSource];
    });
  }
  listenCancelMails() {
    this.mailCancelSubscription = this.socketService.listenCancelMail().subscribe((id_mail) => {
      this.dataSource = this.dataSource.filter((item) => item._id !== id_mail);
    });
  }
}
