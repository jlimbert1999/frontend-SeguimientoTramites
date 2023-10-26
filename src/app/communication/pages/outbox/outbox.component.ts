import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { OutboxService } from '../../services/outbox.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { createFullName } from 'src/app/helpers/fullname.helper';
import { SocketService } from 'src/app/services/socket.service';
import { communication, groupedCommunication } from '../../interfaces';
import { ExternalService, InternalService } from 'src/app/procedures/services';
import { AlertManager } from 'src/app/shared/helpers/alerts';

@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OutboxComponent implements OnInit, AfterViewInit {
  displayedColumns = ['alterno', 'descripcion', 'estado', 'fecha_envio', 'situacion', 'opciones', 'expand'];
  dataSource: groupedCommunication[] = [];
  isLoadingResults = true;
  expandedElement: communication | null;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private externoService: ExternalService,
    private internoService: InternalService,
    private outboxService: OutboxService,
    public paginatorService: PaginatorService,
    private router: Router,
    private socketService: SocketService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    if (this.paginatorService.searchMode) {
      this.outboxService
        .search(
          this.paginatorService.limit,
          this.paginatorService.offset,
          this.paginatorService.searchParams.get('text')!
        )
        .subscribe((data) => {
          this.dataSource = data.mails;
          this.paginatorService.length = data.length;
        });
    } else {
      this.outboxService
        .getOutboxOfAccount(this.paginatorService.limit, this.paginatorService.offset)
        .subscribe((data) => {
          this.dataSource = data.mails;
          this.paginatorService.length = data.length;
        });
    }
  }

  generar_hoja_ruta(id_tramite: string, tipo_hoja: 'tramites_externos' | 'tramites_internos') {
    if (tipo_hoja === 'tramites_externos') {
      // this.externoService.getProcedure(id_tramite).subscribe((data) => {
      // externalRouteMap(data.procedure, data.workflow)
      // HojaRutaExterna(data.procedure, data.workflow, this.authService.account.id_account)
      // });
    } else {
      // this.internoService
      //   .getAllDataInternalProcedure(id_tramite)
      //   .subscribe((data) => {
      //     // HojaRutaInterna(data.procedure, data.workflow, this.authService.account.id_account)
      //     // internalRouteMap(data.procedure, data.workflow)
      //   });
    }
  }

  showDetail(mail: groupedCommunication) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
      ...(this.paginatorService.searchMode && { search: true }),
    };
    this.router.navigate(['bandejas/salida', mail._id.procedure._id], {
      queryParams: params,
    });
  }

  cancelSend(mail: groupedCommunication, selectedSendIds: string[] | null) {
    if (!selectedSendIds) return;
    AlertManager.showQuestionAlert(
      `Cancelar envios del tramite ${mail._id.procedure.code}?`,
      `Envios a cancelar: ${selectedSendIds.length}`,
      () => {
        this.outboxService.cancelMail(mail._id.procedure._id, selectedSendIds).subscribe((data) => {
          if (mail.sendings.length === selectedSendIds.length) {
            this.getData();
          } else {
            const index = this.dataSource.findIndex((item) => item._id === mail._id);
            this.dataSource[index].sendings = mail.sendings.filter((send) => !selectedSendIds.includes(send._id));
          }
        });
      }
    );
  }
  selectAllItemsList(list: MatSelectionList) {
    list._items.forEach((item) => {
      if (!item.disabled) {
        item.selected = true;
      }
    });
  }
}
