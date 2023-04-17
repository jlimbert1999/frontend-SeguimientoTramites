import { Component } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-report-tipo-options',
  templateUrl: './report-tipo-options.component.html',
  styleUrls: ['./report-tipo-options.component.css']
})
export class ReportTipoOptionsComponent {
  groupProcedures: 'tramites_externos' | 'tramites_internos' = 'tramites_externos'
  tipos: any[] = []
  states: string[] = [
    'INSCRITO',
    'OBSERVADO',
    'CONCLUIDO',
    'EN REVISION'
  ]
  constructor(private reportService: ReporteService) {
    this.reportService.getTypesProceduresForReports(this.groupProcedures).subscribe(tipos => {
      this.tipos = tipos
    })

  }

}
