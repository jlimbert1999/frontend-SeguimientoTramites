import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AlertService, PaginatorService, PdfGeneratorService } from 'src/app/shared/services';
import { ProcedureService } from 'src/app/procedures/services';
import { OutboxService } from '../../services/outbox.service';

import { GroupedCommunication } from '../../models';

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
  displayedColumns = ['code', 'reference', 'state', 'startDate', 'expand', 'menu-options'];
  dataSource = signal<GroupedCommunication[]>([]);
  expandedElement: GroupedCommunication | null;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private alertService: AlertService,
    private outboxService: OutboxService,
    private paginatorService: PaginatorService<string>,
    private procedureService: ProcedureService,
    private pdf: PdfGeneratorService
  ) {}

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

  generateRouteMap({ _id: { procedure } }: GroupedCommunication) {
    this.procedureService.getFullProcedure(procedure._id, procedure.group).subscribe((data) => {
      this.pdf.generateRouteSheet(data.procedure, data.workflow);
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
    this.dataSource.update((values) => {
      const filteredData = values.filter(
        (element) => `${element._id.account}-${element._id.outboundDate}-${element._id.procedure._id}` !== id
      );
      return [...filteredData];
    });
    this.paginatorService.length--;
  }
}
