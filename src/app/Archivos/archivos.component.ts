import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ArchivoService } from './services/archivo.service';

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent {
  dataSource: any[] = []
  displayedColumns: string[] = ['alterno', 'estado', 'funcionario', 'descripcion', 'opciones'];

  constructor(
    private archivoService: ArchivoService
  ) {
    this.get()
  }

  get() {
    this.archivoService.Get().subscribe(tramites => {
      this.dataSource = tramites
    })
  }

  unarchive(archivo: any) {

    Swal.fire({
      icon: 'question',
      title: `Desarchivar el tramite: ${archivo.tramite.alterno}?`,
      text: `El tramite volvera a estar en la bandeja para su remision`,
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
        this.archivoService.Unarchive(archivo._id, result.value!).subscribe(message => {
          Swal.fire({ title: message, icon: 'success' })
        })
      }
    })
  }

}
