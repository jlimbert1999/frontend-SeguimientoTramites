import { Component } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import Swal from 'sweetalert2';
import { ArchivoService } from './services/archivo.service';
import { PaginatorService } from '../shared/services/paginator.service';

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css'],
  animations: [
    fadeInOnEnterAnimation(),
  ]

})
export class ArchivosComponent {
  
  dataSource: any[] = []
  displayedColumns: string[] = ['alterno', 'estado', 'funcionario', 'descripcion', 'fecha','opciones'];

  constructor(
    private archivoService: ArchivoService,
    public paginatorService: PaginatorService
  ) {
    this.get()
  }

  get() {
    this.archivoService.Get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
      console.log(data.archives);
      this.dataSource = data.archives
      this.paginatorService.length = data.length
    })
  }

  unarchive(archive: any) {
    Swal.fire({
      icon: 'question',
      title: `Desarchivar el tramite: ${archive.procedure.alterno}?`,
      text: `Ingrese el motivo para el desarchivo`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Desarchivar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar una descripcion para desarchivar'
          )
        }

      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Desarchivando el tramite....',
          text: 'Por favor espere',
          allowOutsideClick: false,
        });
        Swal.showLoading();
        this.archivoService.unarchive(archive._id, result.value!).subscribe(message => {
          Swal.fire({ title: message, icon: 'success' })
          this.dataSource = [...this.dataSource.filter(element => element._id !== archive._id)]
        })
      }
    })
  }

  applyFilter(event: Event) {
    this.paginatorService.offset = 0
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginatorService.text = filterValue;
    // this.Get()
  }

  cancelSearch() {
    this.paginatorService.offset = 0;
    this.paginatorService.text = "";
    // this.Get();
  }


}
