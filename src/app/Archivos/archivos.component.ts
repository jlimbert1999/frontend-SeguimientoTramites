import { Component } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import Swal from 'sweetalert2';
import { ArchivoService } from './services/archivo.service';
import { PaginatorService } from '../shared/services/paginator.service';
import { Router } from '@angular/router';

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
  displayedColumns: string[] = ['group', 'alterno', 'estado', 'funcionario', 'descripcion', 'fecha', 'opciones'];


  constructor(
    private archivoService: ArchivoService,
    public paginatorService: PaginatorService,
    private router: Router
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
