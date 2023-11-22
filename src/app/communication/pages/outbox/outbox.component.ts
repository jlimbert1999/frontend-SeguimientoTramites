import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { OutboxService } from '../../services/outbox.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { communication, groupedCommunication } from '../../interfaces';
import { AlertManager } from 'src/app/shared/helpers/alerts';
import { ProcedureService } from 'src/app/procedures/services';
import { createRouteMap } from 'src/app/procedures/helpers';
import { groupProcedure } from 'src/app/procedures/interfaces';

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
  displayedColumns = ['code', 'reference', 'state', 'startDate', 'expand', 'menu-options'];
  dataSource: groupedCommunication[] = [];
  isLoadingResults = true;
  expandedElement: communication | null;

  constructor(
    public dialog: MatDialog,
    private outboxService: OutboxService,
    public paginatorService: PaginatorService,
    public procedureService: ProcedureService,
    private router: Router
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
          this.paginatorService.searchParams.get('text')! as string
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

  generateRouteMap(mail: communication) {
    this.procedureService.getFullProcedure(mail.procedure._id, mail.procedure.group).subscribe((data) => {
      createRouteMap(data.procedure, data.workflow);
    });
  }

  showDetail(mail: groupedCommunication) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
      ...(this.paginatorService.searchMode && { search: true }),
    };

    this.router.navigate(['bandejas/salida', this.getUrlToNavigate(mail._id.procedure.group), mail._id.procedure._id], {
      queryParams: params,
    });
  }

  cancelSend(mail: groupedCommunication, selectedSendIds: string[] | null) {
    if (!selectedSendIds) return;
    AlertManager.showQuestionAlert(
      `¿Cancelar envios del tramite ${mail._id.procedure.code}?`,
      `Envios a cancelar: ${selectedSendIds.length}`,
      () => {
        this.outboxService.cancelMail(mail._id.procedure._id, selectedSendIds).subscribe((message) => {
          const index = this.dataSource.findIndex((item) => item._id === mail._id);
          this.dataSource[index].sendings = mail.sendings.filter((send) => !selectedSendIds.includes(send._id));
          if (this.dataSource[index].sendings.length === 0) {
            this.dataSource = this.dataSource.filter((item) => item._id !== mail._id);
            this.paginatorService.length -= 1;
          }
          AlertManager.showSuccesAltert('Envio cancelado correctamente', message);
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

  getUrlToNavigate(group: groupProcedure): string {
    const validRoutes = {
      ExternalDetail: 'externos',
      InternalDetail: 'internos',
    };
    return validRoutes[group];
  }
}
