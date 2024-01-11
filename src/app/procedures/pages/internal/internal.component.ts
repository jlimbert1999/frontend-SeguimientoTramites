import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { SendDialogComponent } from 'src/app/communication/dialogs/send-dialog/send-dialog.component';
import { RegisterInternalComponent } from '../register-internal/register-internal.component';

import { ArchiveService, InternalService, ProcedureService } from '../../services';

import { EventProcedureDto } from '../../dtos';
import { InternalProcedure } from '../../models';
import { groupProcedure, stateProcedure } from '../../interfaces';
import { TransferDetails } from 'src/app/communication/interfaces';
import { AlertService, PaginatorService, PdfGeneratorService } from 'src/app/shared/services';

interface CacheStorage {
  text: string;
  data: InternalProcedure[];
}
@Component({
  selector: 'app-internal',
  templateUrl: './internal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalComponent implements OnInit {
  displayedColumns: string[] = ['code', 'reference', 'applicant', 'state', 'startDate', 'send', 'menu-options'];
  datasource = signal<InternalProcedure[]>([]);
  textForSearch: string = '';

  constructor(
    private dialog: MatDialog,
    private internoService: InternalService,
    private procedureService: ProcedureService,
    private paginatorService: PaginatorService<CacheStorage>,
    private alertService: AlertService,
    private archiveService: ArchiveService,
    private readonly pdf: PdfGeneratorService
  ) {
    inject(DestroyRef).onDestroy(() => {
      this.savePaginationData();
      this.paginatorService.keepAliveData = false;
    });
  }
  ngOnInit(): void {
    this.loadPaginationData();
  }

  getData(): void {
    const subscription: Observable<{ procedures: InternalProcedure[]; length: number }> =
      this.textForSearch !== ''
        ? this.internoService.search(this.textForSearch, this.paginatorService.limit, this.paginatorService.offset)
        : this.internoService.findAll(this.paginatorService.limit, this.paginatorService.offset);
    subscription.subscribe((data) => {
      this.datasource.set(data.procedures);
      this.paginatorService.length = data.length;
    });
  }

  applyFilter(term: string) {
    this.paginatorService.offset = 0;
    this.textForSearch = term;
    this.getData();
  }

  add() {
    const dialogRef = this.dialog.open<RegisterInternalComponent, undefined, InternalProcedure>(
      RegisterInternalComponent,
      {
        width: '1000px',
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((createdProcedure) => {
      if (createdProcedure) {
        this.paginatorService.length++;
        this.datasource.update((values) => {
          if (this.datasource.length === this.paginatorService.limit) values.pop();
          return [createdProcedure, ...values];
        });
        this.send(createdProcedure);
      }
    });
  }

  edit(tramite: InternalProcedure) {
    const dialogRef = this.dialog.open<RegisterInternalComponent, InternalProcedure, InternalProcedure>(
      RegisterInternalComponent,
      {
        width: '1000px',
        disableClose: true,
        data: tramite,
      }
    );
    dialogRef.afterClosed().subscribe((updatedProcedure) => {
      if (updatedProcedure) {
        this.datasource.update((values) => {
          const indexFound = values.findIndex((element) => element._id === updatedProcedure._id);
          values[indexFound] = updatedProcedure;
          return [...values];
        });
      }
    });
  }
  send(procedure: InternalProcedure) {
    const dialogRef = this.dialog.open<SendDialogComponent, TransferDetails, string>(SendDialogComponent, {
      width: '1200px',
      data: {
        id_procedure: procedure._id,
        code: procedure.code,
        attachmentQuantity: procedure.amount,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((message) => {
      if (message) {
        this.datasource.update((values) => {
          const indexFound = values.findIndex((element) => element._id === procedure._id);
          values[indexFound].isSend = true;
          return [...values];
        });
      }
    });
  }

  generateRouteMap(id_tramite: string, group: groupProcedure) {
    this.procedureService.getFullProcedure(id_tramite, group).subscribe((data) => {
      this.pdf.generateRouteSheet(data.procedure, data.workflow);
    });
  }

  conclude(procedure: InternalProcedure) {
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
        this.archiveService.archiveProcedure(archive).subscribe((data) => {
          this.datasource.update((values) => {
            const indexFound = values.findIndex((element) => element._id === procedure._id);
            values[indexFound].state = stateProcedure.CONCLUIDO;
            return [...values];
          });
        });
      }
    );
  }

  private savePaginationData(): void {
    this.paginatorService.cache[this.constructor.name] = {
      data: this.datasource(),
      text: this.textForSearch,
    };
  }

  private loadPaginationData(): void {
    const cacheData = this.paginatorService.cache[this.constructor.name];
    if (!this.paginatorService.keepAliveData || !cacheData) {
      this.getData();
      return;
    }
    this.datasource.set(cacheData.data);
    this.textForSearch = cacheData.text;
  }

  get PageParams() {
    return this.paginatorService.PageParams;
  }
}
