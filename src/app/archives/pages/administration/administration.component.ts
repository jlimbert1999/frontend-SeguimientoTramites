import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { ArchivoService } from '../../services/archivo.service';
import { communication } from 'src/app/communication/interfaces';
import { EventProcedureDto } from '../../dtos/event_procedure.dto';
import { stateProcedure } from 'src/app/procedures/interfaces';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss'],
})
export class AdministrationComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['procedure', 'reference', 'manager', 'options'];
  dataSource: communication[] = [];
  subscription: Subscription;
  constructor(
    private readonly archiveService: ArchivoService,
    private readonly paginatorService: PaginatorService,
    private readonly socketService: SocketService
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
}
