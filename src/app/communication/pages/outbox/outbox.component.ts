import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, AfterViewInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { OutboxService } from '../../services/outbox.service';
import { communicationResponse, groupedCommunicationResponse } from '../../interfaces';
import { ProcedureService } from 'src/app/procedures/services';
import { groupProcedure } from 'src/app/procedures/interfaces';
import { AlertService, PaginatorService } from 'src/app/shared/services';
import { GroupedCommunication } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  dataSource = signal<GroupedCommunication[]>([]);
  expandedElement: communicationResponse | null;

  constructor(
    public dialog: MatDialog,
    private outboxService: OutboxService,
    public paginatorService: PaginatorService,
    public procedureService: ProcedureService,
    public alertService: AlertService,
    private router: Router
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    const observable: Observable<{ mails: GroupedCommunication[]; length: number }> = this.paginatorService.isSearchMode
      ? this.outboxService.search(this.paginatorService.PaginationParams, this.paginatorService.cache['text'])
      : this.outboxService.findAll(this.paginatorService.PaginationParams);
    observable.subscribe((data) => {
      this.dataSource.set(data.mails);
      this.paginatorService.length = data.length;
    });
  }

  generateRouteMap(mail: communicationResponse) {
    this.procedureService.getFullProcedure(mail.procedure._id, mail.procedure.group).subscribe((data) => {
      // createRouteMap(data.procedure, data.workflow);
    });
  }

  showDetail({ _id: { procedure } }: GroupedCommunication) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.index,
      ...(this.paginatorService.searchMode() && { search: true }),
    };

    this.router.navigate(['bandejas/salida', procedure.group, procedure._id], {
      queryParams: params,
    });
  }

  cancelSend(mail: GroupedCommunication, selectedSendIds: string[] | null) {
    if (!selectedSendIds) return;
    this.alertService.showQuestionAlert(
      `¿Cancelar envios del tramite ${mail._id.procedure.code}?`,
      `Envios a cancelar: ${selectedSendIds.length}`,
      () => {
        this.outboxService.cancelMail(mail._id.procedure._id, selectedSendIds).subscribe((message) => {
          const index = this.dataSource().findIndex((item) => item._id === mail._id);
          this.dataSource()[index].detail = mail.detail.filter((send) => !selectedSendIds.includes(send._id));
          if (this.dataSource()[index].detail.length === 0) {
            this.dataSource.set(this.dataSource().filter((item) => item._id !== mail._id));
            this.paginatorService.length -= 1;
          }
          this.alertService.showSuccesAltert('Envio cancelado correctamente', message);
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
