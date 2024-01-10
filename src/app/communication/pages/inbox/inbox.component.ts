import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import { SendDialogComponent } from '../../dialogs/send-dialog/send-dialog.component';

import { ProcedureService, ArchiveService } from 'src/app/procedures/services';
import { SocketService } from 'src/app/services/socket.service';
import { InboxService } from '../../services/inbox.service';

import { stateProcedure } from 'src/app/procedures/interfaces';
import { EventProcedureDto } from 'src/app/procedures/dtos';
import { TransferDetails, communicationResponse, statusMail } from '../../interfaces';
import { AlertService, PaginatorService, PdfGeneratorService } from 'src/app/shared/services';
import { Communication } from '../../models';

interface Params {
  status?: statusMail;
  text?: string;
}
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
  public status = signal<statusMail | undefined>(undefined);

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private paginatorService: PaginatorService<Params>,
    private procedureService: ProcedureService,
    private archiveService: ArchiveService,
    private socketService: SocketService,
    private inboxService: InboxService,
    private alertService: AlertService,
    private pdf: PdfGeneratorService
  ) {
    this.listenNewMails();
    this.listenCancelMails();
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
          text: this.paginatorService.cache['inbox'].text ?? '',
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

  acceptMail(mail: Communication) {
    this.alertService.showQuestionAlert(
      `¿Aceptar tramite ${mail.procedure.code}?`,
      `El tramite sera marcado como aceptado`,
      () => {
        this.inboxService.acceptMail(mail._id).subscribe(
          (resp) => {
            this.dataSource.update((values) => {
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

  showDetail(mail: Communication) {
    if (this.status()) this.paginatorService.cache['inbox'].status = this.status();
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.index,
      ...(this.paginatorService.searchMode() && { search: true }),
    };
    this.router.navigate(['bandejas/entrada', mail._id], {
      queryParams: params,
    });
  }

  private listenNewMails() {
    this.socketService
      .listenMails()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mail) => {
        this.dataSource.update((values) => [mail, ...values]);
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
    this.dataSource.update((values) => values.filter((element) => element._id !== id_mail));
    this.paginatorService.length--;
  }

  get state() {
    return stateProcedure;
  }
}
