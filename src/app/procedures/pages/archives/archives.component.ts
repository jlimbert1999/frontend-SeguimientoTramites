import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AlertService, PaginatorService } from 'src/app/shared/services';
import { SocketService } from 'src/app/services/socket.service';
import { ArchiveService } from '../../services/archive.service';

import { EventDialogComponent } from '../../dialogs/event-dialog/event-dialog.component';

import { Communication } from 'src/app/communication/models';
import { EventProcedureDto } from '../../dtos/event_procedure.dto';

import { groupProcedure, stateProcedure } from 'src/app/procedures/interfaces';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchivesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['code', 'reference', 'state', 'manager', 'show-detail', 'options'];
  dataSource = signal<Communication[]>([]);
  constructor(
    private readonly archiveService: ArchiveService,
    private readonly paginatorService: PaginatorService,
    private readonly socketService: SocketService,
    private readonly alertService: AlertService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.getData();
  }

  ngOnInit(): void {
    this.listenUnarchives();
  }

  ngOnDestroy(): void {}

  getData() {
    const subscription: Observable<{ mails: Communication[]; length: number }> = this.paginatorService.isSearchMode
      ? this.archiveService.search(this.paginatorService.cache['text'], this.paginatorService.PaginationParams)
      : this.archiveService.findAll(this.paginatorService.PaginationParams);
    subscription.subscribe((data) => {
      this.dataSource.set(data.mails);
      this.paginatorService.length = data.length;
    });
  }

  unarchive(mail: Communication) {
    this.alertService.showConfirmAlert(
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
          // this.dataSource = this.dataSource.filter((element) => element._id !== mail._id);
        });
      }
    );
  }

  showDetails(mail: Communication) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.index,
      ...(this.paginatorService.searchMode() && { search: true }),
    };
    this.router.navigate(['/tramites/archivados/', mail.procedure.group, mail.procedure._id], {
      queryParams: params,
    });
  }

  showTimeline(mail: Communication) {
    this.dialog.open(EventDialogComponent, {
      width: '1200px',
      data: mail,
      disableClose: true,
    });
  }

  listenUnarchives() {
    // this.subscription = this.socketService.listenUnarchives().subscribe((id_mail) => {
    //   this.dataSource = this.dataSource.filter((element) => element._id !== id_mail);
    //   this.dialog.closeAll();
    // });
  }
}
