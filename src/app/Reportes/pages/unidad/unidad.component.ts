import { Component } from '@angular/core';
import { DependenciasService } from 'src/app/Configuraciones/services/dependencias.service';

@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.css']
})
export class UnidadComponent {
  Instituciones: any[] = []
  constructor(private dependenciasService: DependenciasService) {
    this.dependenciasService.getInstituciones().subscribe(data => {
      this.Instituciones = data
    })
  }

}
