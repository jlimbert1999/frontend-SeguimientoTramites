import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { SendDialogComponent } from 'src/app/communication/dialogs/send-dialog/send-dialog.component';
import { RegisterExternalComponent } from '../register-external/register-external.component';

import { ArchiveService, ExternalService, ProcedureService } from '../../services';

import { ExternalProcedure } from '../../models';
import { EventProcedureDto } from '../../dtos';
import { external, groupProcedure, stateProcedure } from '../../interfaces';
import { TransferDetails } from 'src/app/communication/interfaces';
import { AlertService, PaginatorService, PdfGeneratorService } from 'src/app/shared/services';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalComponent implements OnInit {
  dataSource = signal<ExternalProcedure[]>([]);
  displayedColumns: string[] = ['code', 'reference', 'applicant', 'state', 'startDate', 'send', 'menu-options'];
  textSearch: string = '';
  constructor(
    public dialog: MatDialog,
    private readonly externalService: ExternalService,
    private readonly procedureService: ProcedureService,
    private readonly paginatorService: PaginatorService<{ text: string; data: ExternalProcedure[] }>,
    private readonly archiveService: ArchiveService,
    private readonly alertService: AlertService,
    private readonly pdf: PdfGeneratorService
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.savePaginationData();
    });
  }
  ngOnInit(): void {
    this.loadPaginationData();
  }

  getData() {
    const subscription: Observable<{ procedures: ExternalProcedure[]; length: number }> = this.textSearch
      ? this.externalService.search(this.textSearch, this.paginatorService.limit, this.paginatorService.offset)
      : this.externalService.findAll(this.paginatorService.limit, this.paginatorService.offset);
    subscription.subscribe((data) => {
      this.dataSource.set(data.procedures);
      this.paginatorService.length = data.length;
    });
  }

  search(term: string) {
    this.paginatorService.offset = 0;
    this.textSearch = term;
    this.getData();
  }

  add() {
    const dialogRef = this.dialog.open<RegisterExternalComponent, undefined, ExternalProcedure>(
      RegisterExternalComponent,
      {
        width: '1000px',
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((createdProcedure) => {
      if (!createdProcedure) return;
      this.paginatorService.length++;
      this.dataSource.update((values) => {
        if (this.dataSource.length === this.paginatorService.limit) values.pop();
        return [createdProcedure, ...values];
      });
      this.send(createdProcedure);
    });
  }

  edit(procedure: ExternalProcedure) {
    const dialogRef = this.dialog.open<RegisterExternalComponent, ExternalProcedure, ExternalProcedure>(
      RegisterExternalComponent,
      {
        width: '1000px',
        data: procedure,
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((updatedProcedure) => {
      if (!updatedProcedure) return;
      this.dataSource.update((values) => {
        const indexFound = values.findIndex((element) => element._id === updatedProcedure._id);
        values[indexFound] = updatedProcedure;
        return [...values];
      });
    });
  }

  send(procedure: ExternalProcedure) {
    const dialogRef = this.dialog.open<SendDialogComponent, TransferDetails, string>(SendDialogComponent, {
      width: '1200px',
      data: {
        id_procedure: procedure._id,
        attachmentQuantity: procedure.amount,
        code: procedure.code,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((message) => {
      if (!message) return;
      this.dataSource.update((values) => {
        const indexFound = values.findIndex((element) => element._id === procedure._id);
        values[indexFound].isSend = true;
        return [...values];
      });
    });
  }

  generateRouteMap(id_procedure: string, group: groupProcedure) {
    this.procedureService.getFullProcedure(id_procedure, group).subscribe((data) => {
      this.pdf.generateRouteSheet(data.procedure, data.workflow);
    });
  }

  generateTicket(tramite: external) {}

  conclude(procedure: external) {
    this.alertService.showConfirmAlert(
      `¿Concluir el tramite ${procedure.code}?`,
      'Los tramites concluidos desde su administacion no pueden ser desarchivados',
      'Ingrese una referencia para concluir',
      (description) => {
        const archive: EventProcedureDto = {
          procedure: procedure._id,
          description,
          stateProcedure: stateProcedure.CONCLUIDO,
        };
        this.dataSource.update((values) => {
          const indexFound = values.findIndex((element) => element._id === procedure._id);
          values[indexFound].state = stateProcedure.CONCLUIDO;
          return [...values];
        });
      }
    );
  }

  private savePaginationData(): void {
    this.paginatorService.cache[this.constructor.name] = {
      data: this.dataSource(),
      text: this.textSearch,
    };
  }

  private loadPaginationData(): void {
    const cacheData = this.paginatorService.cache[this.constructor.name];
    if (!this.paginatorService.keepAliveData || !cacheData) {
      this.getData();
      return;
    }
    this.dataSource.set(cacheData.data);
    this.textSearch = cacheData.text;
  }

  get PageParams() {
    return this.paginatorService.PageParams;
  }
}
