import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { ArchiveService } from '../../services/archive.service';
import { communication } from 'src/app/communication/interfaces';
import { stateProcedure } from 'src/app/procedures/interfaces';
import { SocketService } from 'src/app/services/socket.service';
import { EventProcedureDto } from '../../dtos/event_procedure.dto';
import { EventDialogComponent } from '../../dialogs/event-dialog/event-dialog.component';
import { AlertManager } from 'src/app/shared/helpers/alerts';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss'],
})
export class ArchivesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['procedure', 'reference', 'manager', 'show-detail', 'options'];
  dataSource: communication[] = [];
  subscription: Subscription;
  constructor(
    private readonly archiveService: ArchiveService,
    private readonly paginatorService: PaginatorService,
    private readonly socketService: SocketService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.getData();
  }

  ngOnInit(): void {
    this.listenUnarchives();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getData() {
    const subscription: Observable<{ archives: communication[]; length: number }> = this.paginatorService.isSearchMode
      ? this.archiveService.search(
          this.paginatorService.searchParams.get('text')!,
          this.paginatorService.limit,
          this.paginatorService.offset
        )
      : this.archiveService.getAll(this.paginatorService.limit, this.paginatorService.offset);
    subscription.subscribe((data) => {
      this.dataSource = data.archives;
      this.paginatorService.length = data.length;
    });
  }

  unarchive(mail: communication) {
    AlertManager.showConfirmAlert(
      `¿Desarchivar el tramite ${mail.procedure.code}?`,
      `El tramite volvera a su bandeja de entrada`,
      'Ingrese una referencia para desarchivar',
      (description) => {
        const archiveDto: EventProcedureDto = {
          description,
          procedure: mail.procedure._id,
          stateProcedure: stateProcedure.CONCLUIDO,
        };
        this.archiveService.unarchiveMail(mail._id, archiveDto).subscribe(() => {
          this.dataSource = this.dataSource.filter((element) => element._id !== mail._id);
        });
      }
    );
  }

  showDetails(mail: communication) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
      ...(this.paginatorService.searchMode && { search: true }),
    };
    this.router.navigate(['/tramites/archivados', mail.procedure._id], {
      queryParams: params,
    });
  }
  showTimeline(mail: communication) {
    this.dialog.open(EventDialogComponent, {
      width: '1200px',
      data: mail,
      disableClose: true,
    });
  }

  listenUnarchives() {
    this.subscription = this.socketService.listenUnarchives().subscribe((id_mail) => {
      this.dataSource = this.dataSource.filter((element) => element._id !== id_mail);
      this.dialog.closeAll();
    });
  }
}
