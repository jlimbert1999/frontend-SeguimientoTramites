import { Component } from '@angular/core';
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

  unarchive(){

  }

}
