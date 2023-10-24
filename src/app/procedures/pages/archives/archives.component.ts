import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { ArchiveService } from '../../services/archive.service';
import { communication } from 'src/app/communication/interfaces';
import { stateProcedure } from 'src/app/procedures/interfaces';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { EventProcedureDto } from '../../dtos/event_procedure.dto';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss'],
})
export class ArchivesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['procedure', 'reference', 'manager', 'options'];
  dataSource: communication[] = [];
  subscription: Subscription;
  constructor(
    private readonly archiveService: ArchiveService,
    private readonly paginatorService: PaginatorService,
    private readonly socketService: SocketService,
    private router: Router
  ) {
    this.Get();
  }

  ngOnInit(): void {
    this.subscription = this.socketService
      .listenUnarchives()
      .subscribe((res) => {
        this.dataSource = this.dataSource.filter(
          (element) => element._id !== res
        );
      });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  Get() {
    this.archiveService
      .getAll(this.paginatorService.limit, this.paginatorService.offset)
      .subscribe((data) => {
        console.log(data);
        this.dataSource = data.archives;
        this.paginatorService.length = data.length;
      });
  }

  unarchive(mail: communication) {
    Swal.fire({
      icon: 'question',
      title: `¿Desarchivar el tramite ${mail.procedure.code}?`,
      text: `El tramite volvera a su bandeja de entrada`,
      inputPlaceholder: 'Ingrese una referencia para desarchivar',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> La referencia es obligatoria'
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const archiveDto: EventProcedureDto = {
          description: result.value,
          procedure: mail.procedure._id,
          stateProcedure: stateProcedure.CONCLUIDO,
        };
        this.archiveService
          .unarchive(mail._id, archiveDto)
          .subscribe((data) => console.log(data));
      }
    });
  }

  view(mail: communication) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
    };
    this.router.navigate(['/tramites/archivados', mail.procedure._id], {
      queryParams: params,
    });
  }
}
