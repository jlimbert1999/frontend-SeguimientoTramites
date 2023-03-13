import { Component } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { HojaRutaDetalles } from '../../pdf-externos/pdf-ruta';
import { PDF_FichaExterno } from '../../pdf/reporte-ficha';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.component.html',
  styleUrls: ['./ficha.component.css'],
  animations: [
    fadeInOnEnterAnimation(),
  ]
})
export class FichaComponent {
  alterno: string
  Tramite: any
  Workflow:any[]
  tipo: string
  constructor(private reporteService: ReporteService) {

  }
  generate() {
    this.reporteService.getReporteFicha(this.alterno).subscribe(data => {
      this.tipo = data.tipo
      this.Tramite = data.tramite
      this.Workflow=data.workflow
      console.log(data)
    })
  }

  pdf(){
    if(this.tipo==='tramites_externos'){
      PDF_FichaExterno(this.Tramite, this.Workflow, '')
    }

  }

}
