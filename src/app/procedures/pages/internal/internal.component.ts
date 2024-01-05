import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SendDialogComponent } from 'src/app/communication/dialogs/send-dialog/send-dialog.component';
import { RegisterInternalComponent } from '../register-internal/register-internal.component';

import { ArchiveService, InternalService, ProcedureService } from '../../services';

import { EventProcedureDto } from '../../dtos';
import { InternalProcedure } from '../../models';
import { groupProcedure, stateProcedure } from '../../interfaces';
import { TransferDetails } from 'src/app/communication/interfaces';
import { AlertService, PaginatorService, PdfGeneratorService } from 'src/app/shared/services';

@Component({
  selector: 'app-internal',
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalComponent implements OnInit {
  displayedColumns: string[] = ['code', 'reference', 'applicant', 'state', 'startDate', 'send', 'menu-options'];
  dataSource = signal<InternalProcedure[]>([]);

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private internoService: InternalService,
    public procedureService: ProcedureService,
    public paginatorService: PaginatorService,
    private alertService: AlertService,
    private archiveService: ArchiveService,
    private readonly pdf: PdfGeneratorService
  ) {}

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    const subscription: Observable<{ procedures: InternalProcedure[]; length: number }> = this.paginatorService
      .isSearchMode
      ? this.internoService.search(
          this.paginatorService.cache['text'],
          this.paginatorService.limit,
          this.paginatorService.offset
        )
      : this.internoService.findAll(this.paginatorService.limit, this.paginatorService.offset);
    subscription.subscribe((data) => {
      this.dataSource.set(data.procedures);
      this.paginatorService.length = data.length;
    });
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
        this.dataSource.update((values) => {
          if (this.dataSource.length === this.paginatorService.limit) values.pop();
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
        this.dataSource.update((values) => {
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
        this.dataSource.update((values) => {
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
          this.dataSource.update((values) => {
            const indexFound = values.findIndex((element) => element._id === procedure._id);
            values[indexFound].state = stateProcedure.CONCLUIDO;
            return [...values];
          });
          this.alertService.showSuccesToast({ title: 'Tramite' });
        });
      }
    );
  }
  
  showDetails(procedure: InternalProcedure) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.index,
      ...(this.paginatorService.searchMode() && { search: true }),
    };
    this.router.navigate(['tramites/internos', procedure.group, procedure._id], {
      queryParams: params,
    });
  }
}
