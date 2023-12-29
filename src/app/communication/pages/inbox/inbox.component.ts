import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import { SendDialogComponent } from '../../dialogs/send-dialog/send-dialog.component';

import { ProcedureService, ArchiveService } from 'src/app/procedures/services';
import { SocketService } from 'src/app/services/socket.service';
import { InboxService } from '../../services/inbox.service';

import { stateProcedure } from 'src/app/procedures/interfaces';
import { createRouteMap } from 'src/app/procedures/helpers';
import { EventProcedureDto } from 'src/app/procedures/dtos';
import { TransferDetails, communicationResponse, statusMail } from '../../interfaces';
import { AlertService, PaginatorService } from 'src/app/shared/services';
import { Communication } from '../../models';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void> = new Subject();
  public displayedColumns: string[] = ['code', 'reference', 'state', 'emitter', 'outboundDate', 'options'];
  public dataSource = signal<Communication[]>([]);
  public status = signal<statusMail | undefined>(this.paginatorService.cache['status']);

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
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getData(): void {
    const observable: Observable<{ mails: Communication[]; length: number }> = this.paginatorService.isSearchMode
      ? this.inboxService.search({
          ...this.paginatorService.PaginationParams,
          text: this.paginatorService.cache['text'],
          status: this.status(),
        })
      : this.inboxService.findAll(this.paginatorService.PaginationParams, this.status());
    observable.subscribe((data) => {
      this.dataSource.set(data.mails);
      this.paginatorService.length = data.length;
    });
  }

  applyStatusFilter(status: statusMail): void {
    this.paginatorService.offset = 0;
    this.status.set(status);
    this.getData();
  }

  send(mail: communicationResponse) {
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

  acceptMail(mail: communicationResponse) {
    // this.alertService.showQuestionAlert(
    //   `¿Aceptar tramite ${mail.procedure.code}?`,
    //   `El tramite sera marcado como aceptado`,
    //   () => {
    //     this.inboxService.acceptMail(mail._id).subscribe(
    //       (resp) => {
    //         const indexFound = this.dataSource.findIndex((item) => item._id === mail._id);
    //         this.dataSource[indexFound].procedure.state = resp.state;
    //         this.dataSource[indexFound].status = statusMail.Received;
    //         this.alertService.showSuccesToast({ title: resp.message });
    //       },
    //       () => {
    //         this.getData();
    //       }
    //     );
    //   }
    // );
  }

  rejectMail(mail: communicationResponse) {
    this.alertService.showConfirmAlert(
      `¿Rechazar tramite ${mail.procedure.code}?`,
      `El tramite sera devuelto al funcionario emisor`,
      'Ingrese el motivo del rechazo',
      (description) => {
        this.inboxService.rejectMail(mail._id, description).subscribe((message) => {
          this.removeMail(mail._id);
          this.alertService.showSuccesToast({ title: message });
        });
      }
    );
  }

  conclude(mail: communicationResponse, isSuspended: boolean) {
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
          this.alertService.showSuccesToast({ title: data.message });
          this.removeMail(mail._id);
        });
      }
    );
  }
  generateRouteMap(mail: Communication) {
    this.procedureService.getFullProcedure(mail.procedure._id, mail.procedure.group).subscribe((data) => {
      // createRouteMap(data.procedure, data.workflow);
    });
  }
  showDetail(mail: Communication) {
    if (this.status()) this.paginatorService.cache['status'] = this.status();
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.index,
      ...(this.paginatorService.searchMode() && { search: true }),
    };
    this.router.navigate(['bandejas/entrada', mail._id], {
      queryParams: params,
    });
  }

  listenNewMails() {
    this.socketService
      .listenMails()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mail) => {
        this.dataSource.update((values) => [mail, ...values]);
        this.paginatorService.length++;
      });
  }
  listenCancelMails() {
    // this.mailCancelSubscription = this.socketService.listenCancelMail().subscribe((id_mail) => {
    //   this.removeMail(id_mail);
    // });
  }

  removeMail(id_mail: string) {
    // this.dataSource = this.dataSource.filter((item) => item._id !== id_mail);
    // this.paginatorService.length -= 1;
  }
}
