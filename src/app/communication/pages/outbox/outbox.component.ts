import { Component, OnInit, signal, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AlertService, PaginatorService, PdfGeneratorService } from 'src/app/shared/services';
import { ProcedureService } from 'src/app/procedures/services';
import { OutboxService } from '../../services/outbox.service';

import { Communication, GroupedCommunication } from '../../models';
import { MatSelectionList } from '@angular/material/list';

interface cacheData {
  communications: GroupedCommunication[];
  text: string;
  length: number;
}

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
export class OutboxComponent implements OnInit {
  public displayedColumns = ['code', 'reference', 'state', 'startDate', 'expand', 'menu-options'];
  public datasource = signal<GroupedCommunication[]>([]);
  public expandedElement: GroupedCommunication | null;
  public textToSearch: string = '';

  constructor(
    public dialog: MatDialog,
    private alertService: AlertService,
    private outboxService: OutboxService,
    private paginatorService: PaginatorService<cacheData>,
    private procedureService: ProcedureService,
    private pdf: PdfGeneratorService
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.savePaginationData();
      this.paginatorService.keepAliveData = false;
      this.paginatorService.length = 0;
    });
  }

  ngOnInit(): void {
    this.loadPaginationData();
  }

  getData() {
    const observable: Observable<{ mails: GroupedCommunication[]; length: number }> = this.textToSearch
      ? this.outboxService.search(this.paginatorService.PaginationParams, this.textToSearch)
      : this.outboxService.findAll(this.paginatorService.PaginationParams);
    observable.subscribe((data) => {
      this.datasource.set(data.mails);
      this.paginatorService.length = data.length;
    });
  }

  applyFilter(term: string) {
    this.textToSearch = term;
    this.paginatorService.offset = 0;
    this.getData();
  }

  generateRouteMap({ _id: { procedure } }: GroupedCommunication) {
    this.procedureService.getFullProcedure(procedure._id, procedure.group).subscribe((data) => {
      this.pdf.generateRouteSheet(data.procedure, data.workflow);
    });
  }

  cancelAll(groupedCommunication: GroupedCommunication) {
    const ids = groupedCommunication.detail.map((item) => item._id);
    this.delete(ids, groupedCommunication);
  }

  cancelSelected(ids: string[] | null, groupedCommunication: GroupedCommunication) {
    if (!ids) return;
    if (ids.length === 0) return;
    this.delete(ids, groupedCommunication);
  }

  private delete(ids: string[], { _id: { account, outboundDate, procedure } }: GroupedCommunication) {
    this.alertService.showQuestionAlert(
      `¿Cancelar envio del tramite ${procedure.code}?`,
      `Se cancelaran ${ids.length} envios.`,
      () => {
        this.outboxService.cancelMails(procedure._id, ids).subscribe(() => {
          const groupId = [account, outboundDate, procedure._id].join('-');
          this.removeMail(groupId, ids);
        });
      }
    );
  }

  private removeMail(groupId: string, ids: string[]) {
    this.datasource.update((values) => {
      const index = values.findIndex(
        ({ _id: { account, outboundDate, procedure } }) => [account, outboundDate, procedure._id].join('-') === groupId
      );
      values[index].detail = values[index].detail.filter((mail) => !ids.includes(mail._id));
      if (values[index].detail.length === 0) {
        values.splice(index, 1);
        this.paginatorService.length--;
      }
      return [...values];
    });
  }

  get PageParams() {
    return this.paginatorService.PageParams;
  }

  private savePaginationData(): void {
    this.paginatorService.cache[this.constructor.name] = {
      communications: this.datasource(),
      text: this.textToSearch,
      length: this.paginatorService.length,
    };
  }

  private loadPaginationData(): void {
    const cacheData = this.paginatorService.cache[this.constructor.name];
    if (!this.paginatorService.keepAliveData || !cacheData) {
      this.getData();
      return;
    }
    this.datasource.set(cacheData.communications);
    this.textToSearch = cacheData.text;
    this.paginatorService.length = cacheData.length;
  }
}
