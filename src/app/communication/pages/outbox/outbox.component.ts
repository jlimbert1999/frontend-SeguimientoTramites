import { Component, OnInit, signal, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AlertService, PaginatorService, PdfGeneratorService } from 'src/app/shared/services';
import { ProcedureService } from 'src/app/procedures/services';
import { OutboxService } from '../../services/outbox.service';

import { GroupedCommunication } from '../../models';

interface cacheData {
  communications: GroupedCommunication[];
  text: string;
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

  cancelMails(mail: GroupedCommunication) {
    this.alertService.showQuestionAlert(
      `¿Cancelar envios del tramite ${mail._id.procedure.code}?`,
      `NRO. DE ENVIOS: ${mail.detail.length}`,
      () => {
        const ids_mails = mail.detail.map((send) => send._id);
        this.outboxService.cancelMails(mail._id.procedure._id, ids_mails).subscribe((resp) => {
          this.removeDatasourceElement(mail);
          this.alertService.showSuccesAltert('Envio cancelado', resp.message);
        });
      }
    );
  }
  removeDatasourceElement({ _id }: GroupedCommunication) {
    const id = `${_id.account}-${_id.outboundDate}-${_id.procedure._id}`;
    this.datasource.update((values) => {
      const filteredData = values.filter(
        (element) => `${element._id.account}-${element._id.outboundDate}-${element._id.procedure._id}` !== id
      );
      return [...filteredData];
    });
    this.paginatorService.length--;
  }

  get PageParams() {
    return this.paginatorService.PageParams;
  }

  private savePaginationData(): void {
    this.paginatorService.cache[this.constructor.name] = {
      communications: this.datasource(),
      text: this.textToSearch,
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
  }
}
