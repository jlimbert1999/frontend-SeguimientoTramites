import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { ArchivoService } from '../../services/archivo.service';
import { communication } from 'src/app/communication/interfaces';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss'],
})
export class AdministrationComponent {
  displayedColumns: string[] = ['procedure', 'reference', 'manager', 'options'];
  dataSource: communication[] = [];
  constructor(
    private readonly archiveService: ArchivoService,
    private readonly paginatorService: PaginatorService
  ) {
    this.Get();
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
        this.archiveService
          .unarchive(mail._id, 'prueba')
          .subscribe((data) => console.log(data));
      }
    });
  }
}
