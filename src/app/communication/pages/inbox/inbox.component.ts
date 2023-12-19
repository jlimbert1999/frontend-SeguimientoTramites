import { Component, OnDestroy, OnInit, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SendDialogComponent } from '../../dialogs/send-dialog/send-dialog.component';

import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { ProcedureService, ArchiveService } from 'src/app/procedures/services';
import { SocketService } from 'src/app/services/socket.service';
import { InboxService } from '../../services/inbox.service';

import { stateProcedure } from 'src/app/procedures/interfaces';
import { createRouteMap } from 'src/app/procedures/helpers';
import { EventProcedureDto } from 'src/app/procedures/dtos';
import { TransferDetails, communication, statusMail } from '../../interfaces';
import { AlertService } from 'src/app/shared/services';

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
  status?: statusMail;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private archiveService: ArchiveService,
    private procedureService: ProcedureService,
    private socketService: SocketService,
    private inboxService: InboxService,
    private paginatorService: PaginatorService,
    private alertService: AlertService
  ) {
    this.listenNewMails();
    this.listenCancelMails();
    this.status = paginatorService.searchParams.get('status') as statusMail;
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
        .searchInboxOfAccount(this.paginatorService.limit, this.paginatorService.offset, {
          text: this.paginatorService.searchParams.get('text')! as string,
          status: this.status,
        })
        .subscribe((resp) => {
          this.dataSource = resp.mails;
          this.paginatorService.length = resp.length;
        });
    } else {
      this.inboxService
        .getInboxOfAccount(this.paginatorService.limit, this.paginatorService.offset, this.status)
        .subscribe((resp) => {
          this.dataSource = resp.mails;
          this.paginatorService.length = resp.length;
        });
    }
  }

  send(mail: communication) {
    const dialogRef = this.dialog.open<SendDialogComponent, TransferDetails, string>(SendDialogComponent, {
      width: '1200px',
      data: {
        id_mail: mail._id,
        id_procedure: mail.procedure._id,
        code: mail.procedure.code,
        attachmentQuantity: mail.attachmentQuantity,
      },
    });
    dialogRef.afterClosed().subscribe((message) => {
      if (message) {
        this.removeMail(mail._id);
      }
    });
  }

  acceptMail(mail: communication) {
    this.alertService.showQuestionAlert(
      `¿Aceptar tramite ${mail.procedure.code}?`,
      `El tramite sera marcado como aceptado`,
      () => {
        this.inboxService.acceptMail(mail._id).subscribe(
          (resp) => {
            const indexFound = this.dataSource.findIndex((item) => item._id === mail._id);
            this.dataSource[indexFound].procedure.state = resp.state;
            this.dataSource[indexFound].status = statusMail.Received;
            this.alertService.showSuccesToast(3000, resp.message);
          },
          () => {
            this.getData();
          }
        );
      }
    );
  }
  rejectMail(mail: communication) {
    this.alertService.showConfirmAlert(
      `¿Rechazar tramite ${mail.procedure.code}?`,
      `El tramite sera devuelto al funcionario emisor`,
      'Ingrese el motivo del rechazo',
      (description) => {
        this.inboxService.rejectMail(mail._id, description).subscribe((message) => {
          this.removeMail(mail._id);
          this.alertService.showSuccesToast(3000, message);
        });
      }
    );
  }
  conclude(mail: communication, isSuspended: boolean) {
    this.alertService.showConfirmAlert(
      `¿${isSuspended ? 'Suspender' : 'Concluir'} el tramite ${mail.procedure.code}?`,
      `El tramite pasara a su seccion de archivos`,
      'Ingrese una referencia para concluir',
      (description) => {
        const archiveDto: EventProcedureDto = {
          description,
          procedure: mail.procedure._id,
          stateProcedure: isSuspended ? stateProcedure.SUSPENDIDO : stateProcedure.CONCLUIDO,
        };
        this.archiveService.archiveMail(mail._id, archiveDto).subscribe((data) => {
          this.alertService.showSuccesToast(3000, data.message);
          this.removeMail(mail._id);
        });
      }
    );
  }
  generateRouteMap(mail: communication) {
    this.procedureService.getFullProcedure(mail.procedure._id, mail.procedure.group).subscribe((data) => {
      createRouteMap(data.procedure, data.workflow);
    });
  }
  showDetail(mail: communication) {
    if (this.status) this.paginatorService.searchParams.set('status', this.status);
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
    // this.mailSubscription = this.socketService.mailSubscription$.subscribe((data) => {
    //   console.log('envet substripction', data);
    //   if (this.paginatorService.limit === this.dataSource.length) this.dataSource.pop();
    //   this.paginatorService.length += 1;
    //   this.dataSource = [data, ...this.dataSource];
    // });
  }
  listenCancelMails() {
    this.mailCancelSubscription = this.socketService.listenCancelMail().subscribe((id_mail) => {
      this.removeMail(id_mail);
    });
  }

  removeMail(id_mail: string) {
    this.dataSource = this.dataSource.filter((item) => item._id !== id_mail);
    this.paginatorService.length -= 1;
  }

  applyExtraFilters() {
    this.paginatorService.offset = 0;
    this.getData();
  }
}
