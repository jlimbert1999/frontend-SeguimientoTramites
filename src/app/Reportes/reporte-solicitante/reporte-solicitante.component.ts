import { Component, OnInit } from '@angular/core';
import { Externo } from 'src/app/Tramites/models/Externo.interface';
import { ReportesExternoService } from '../services/reportes-externo.service';

@Component({
  selector: 'app-reporte-solicitante',
  templateUrl: './reporte-solicitante.component.html',
  styleUrls: ['./reporte-solicitante.component.css']
})
export class ReporteSolicitanteComponent implements OnInit {
  termino: string
  data: Externo[] = []
  displayedColumns: string[] = ['ubicacion', 'alterno', 'tramite', 'descripcion', 'estado', 'solicitante', 'fecha_registro'];

  constructor(private reporteService: ReportesExternoService) { }

  ngOnInit(): void {
  }

  generarReporte() {
    this.reporteService.getReporteSolicitnate(this.termino).subscribe(tramites => {
      this.data = tramites
    })
  }

}
