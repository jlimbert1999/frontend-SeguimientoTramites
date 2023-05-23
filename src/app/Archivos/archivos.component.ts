import { Component } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import Swal from 'sweetalert2';
import { ArchivoService } from './services/archivo.service';
import { PaginatorService } from '../shared/services/paginator.service';
import { Router } from '@angular/router';
import { SocketService } from '../home/services/socket.service';
import { Archive } from './services/models/archive.interface';
import { createFullName } from 'src/app/helpers/fullname.helper';

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
  ]

})
export class ArchivosComponent {

  dataSource: Archive[] = []
  displayedColumns: string[] = ['group', 'alterno', 'estado', 'funcionario', 'descripcion', 'fecha', 'opciones'];

  constructor(
    private archivoService: ArchivoService,
    public paginatorService: PaginatorService,
    private router: Router,
    private socketService: SocketService
  ) {
    this.Get()
  }

  Get() {
    if (this.paginatorService.type) {
      this.archivoService.search(this.paginatorService.text, this.paginatorService.type!, this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.archives
        this.paginatorService.length = data.length
      })
    }
    else {
      this.archivoService.Get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.archives
        this.paginatorService.length = data.length
      })
    }
  }

  unarchive(archive: Archive) {
    console.log(archive);
    Swal.fire({
      icon: 'question',
      title: `Desarchivar el tramite: ${archive.procedure.alterno}?`,
      text: `El tramite regresara a la ${archive.location ? 'bandeja de entrada' : 'administracion'} del funcionario ${createFullName(archive.officer)}`,
      input: 'textarea',
      inputPlaceholder: 'Ingrese el motivo para el desarchivo',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
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
          this.Get()
        })
      }
    })
  }

  applyFilter(event: Event) {
    if (this.paginatorService.type) {
      this.paginatorService.offset = 0
      const filterValue = (event.target as HTMLInputElement).value;
      this.paginatorService.text = filterValue.toLowerCase();
      this.Get()
    }
  }

  selectTypeSearch() {
    if (this.paginatorService.type === undefined) {
      this.paginatorService.text = ''
    }
    this.paginatorService.offset = 0
    this.Get()
  }

  cancelSearch() {
    this.paginatorService.offset = 0;
    this.paginatorService.text = "";
    this.paginatorService.type = undefined
    this.Get();
  }
  View(archive: any) {
    let params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset
    }
    if (this.paginatorService.text !== '') {
      Object.assign(params, { type: this.paginatorService.type })
      Object.assign(params, { text: this.paginatorService.text })
    }
    archive.group === 'tramites_externos'
      ? this.router.navigate(['home/archivos/tramite/ficha-externa', archive.procedure._id], { queryParams: params })
      : this.router.navigate(['home/archivos/tramite/ficha-interna', archive.procedure._id], { queryParams: params })
  }

}
