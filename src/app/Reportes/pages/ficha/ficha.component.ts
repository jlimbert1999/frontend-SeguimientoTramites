import { Component } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { HojaRutaDetalles } from '../../pdf-externos/pdf-ruta';
import { PDF_FichaExterno } from '../../pdf/reporte-ficha';
import { ReporteService } from '../../services/reporte.service';
import { Externo } from 'src/app/Tramites/models/Externo.interface';
import { Interno } from 'src/app/Tramites/models/Interno.interface';
import { WorkflowData } from 'src/app/Bandejas/models/workflow.interface';

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
  tramiteExterno: Externo | undefined
  tramiteInterno: Interno | undefined
  workflow: WorkflowData[] = []
  showResult: boolean = false
  constructor(private reporteService: ReporteService) {

  }
  generate() {
    if (this.alterno !== '') {
      // this.reporteService.getReporteFicha(this.alterno.trim()).subscribe(data => {
      //   if (data.tipo === 'tramites_externos') {
      //     this.tramiteExterno = data.tramite
      //   }
      //   else {
      //     this.tramiteInterno = data.tramite
      //   }
      //   this.workflow = data.workflow
      //   this.showResult = true
      // }, error => {
      //   this.tramiteExterno = undefined
      //   this.tramiteInterno = undefined
      //   this.showResult = false
      // })
    }
  }

  pdf() {
    if (this.tramiteExterno) {
      PDF_FichaExterno(this.tramiteExterno, this.workflow, 'yo')
    }
    else if (this.tramiteInterno) {

    }

  }

}
