import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';

import { SendDialogComponent } from '../../dialogs/send-dialog/send-dialog.component';

import { SocketService } from 'src/app/services/socket.service';
import { ProcedureService, ArchiveService } from 'src/app/procedures/services';
import { InboxService } from '../../services/inbox.service';

import { stateProcedure } from 'src/app/procedures/interfaces';
import { EventProcedureDto } from 'src/app/procedures/dtos';
import { INBOX_CACHE, InboxCache, TransferDetails, communicationResponse, statusMail } from '../../interfaces';
import { AlertService, PaginatorService, PdfGeneratorService } from 'src/app/shared/services';
import { Communication } from '../../models';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxComponent implements OnInit {
  private destroyed$: Subject<void> = new Subject();
  public displayedColumns: string[] = ['code', 'reference', 'state', 'emitter', 'outboundDate', 'options'];
  public datasource = signal<Communication[]>([]);
  public status = signal<statusMail | undefined>(undefined);
  public textToSearch: string = '';

  constructor(
    private dialog: MatDialog,
    private paginatorService: PaginatorService<InboxCache>,
    private procedureService: ProcedureService,
    private archiveService: ArchiveService,
    private socketService: SocketService,
    private inboxService: InboxService,
    private alertService: AlertService,
    private pdf: PdfGeneratorService
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.savePaginationData();
      this.paginatorService.length = 0;
      this.paginatorService.keepAliveData = false;
      this.destroyed$.next();
      this.destroyed$.complete();
    });
  }

  ngOnInit(): void {
    this.listenNewMails();
    this.listenCancelMails();
    this.loadPaginationData();
  }

  getData(): void {
    const observable: Observable<{ mails: Communication[]; length: number }> =
      this.textToSearch !== ''
        ? this.inboxService.search({
            ...this.paginatorService.PaginationParams,
            text: this.textToSearch,
            status: this.status(),
          })
        : this.inboxService.findAll(this.paginatorService.PaginationParams, this.status());
    observable.subscribe((data) => {
      this.datasource.set(data.mails);
      this.paginatorService.length = data.length;
    });
  }

  applyStatusFilter(status: statusMail): void {
    this.paginatorService.offset = 0;
    this.status.set(status);
    this.getData();
  }

  applyTextFilter(term: string): void {
    this.paginatorService.offset = 0;
    this.textToSearch = term;
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

  acceptMail(mail: Communication) {
    this.alertService.showQuestionAlert(
      `¿Aceptar tramite ${mail.procedure.code}?`,
      `El tramite sera marcado como aceptado`,
      () => {
        this.inboxService.acceptMail(mail._id).subscribe(
          (resp) => {
            this.datasource.update((values) => {
              const index = values.findIndex((value) => value._id === mail._id);
              values[index].procedure.state = resp.state;
              values[index].status = statusMail.Received;
              return [...values];
            });
          },
          () => {
            this.getData();
          }
        );
      }
    );
  }

  rejectMail(mail: Communication) {
    this.alertService.showConfirmAlert(
      `¿Rechazar tramite ${mail.procedure.code}?`,
      `El tramite sera devuelto al funcionario emisor`,
      'Ingrese el motivo del rechazo',
      (description) => {
        this.inboxService.rejectMail(mail._id, description).subscribe(() => {
          this.removeMail(mail._id);
        });
      }
    );
  }

  conclude(mail: Communication, state: stateProcedure.CONCLUIDO | stateProcedure.SUSPENDIDO) {
    this.alertService.showConfirmAlert(
      `¿${state === stateProcedure.SUSPENDIDO ? 'Suspender' : 'Concluir'} el tramite ${mail.procedure.code}?`,
      `El tramite pasara a su seccion de archivos`,
      'Ingrese una referencia para concluir',
      (description) => {
        const archiveDto: EventProcedureDto = {
          description,
          procedure: mail.procedure._id,
          stateProcedure: state,
        };
        this.archiveService.archiveMail(mail._id, archiveDto).subscribe(() => {
          this.removeMail(mail._id);
        });
      }
    );
  }

  generateRouteMap(mail: Communication) {
    this.procedureService.getFullProcedure(mail.procedure._id, mail.procedure.group).subscribe((data) => {
      this.pdf.generateRouteSheet(data.procedure, data.workflow);
    });
  }

  private listenNewMails() {
    this.socketService
      .listenMails()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mail) => {
        this.datasource.update((values) => [mail, ...values]);
        this.paginatorService.length++;
      });
  }

  private listenCancelMails() {
    this.socketService
      .listenCancelMail()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((id_mail) => {
        this.removeMail(id_mail);
      });
  }

  private removeMail(id_mail: string) {
    this.datasource.update((values) => values.filter((element) => element._id !== id_mail));
    this.paginatorService.length--;
  }

  get state() {
    return stateProcedure;
  }

  get PageParams() {
    return this.paginatorService.PageParams;
  }

  private savePaginationData(): void {
    this.paginatorService.cache[INBOX_CACHE] = {
      communications: this.datasource(),
      status: this.status(),
      text: this.textToSearch,
      length: this.paginatorService.length,
    };
  }

  private loadPaginationData(): void {
    const cacheData = this.paginatorService.cache[INBOX_CACHE];
    if (!this.paginatorService.keepAliveData || !cacheData) {
      this.getData();
      return;
    }
    this.datasource.set(cacheData.communications);
    this.status.set(cacheData.status);
    this.textToSearch = cacheData.text;
    this.paginatorService.length = cacheData.length;
  }
}
