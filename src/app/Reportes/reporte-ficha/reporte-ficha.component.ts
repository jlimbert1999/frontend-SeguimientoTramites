import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { HojaFicha } from '../pdf-externos/pdf-ficha';
import { HojaRutaDetalles } from '../pdf-externos/pdf-ruta';
import { HojaFichaInterna } from '../pdf-internos/pdf-ficha';
import { HojaRutaInternaDetalles } from '../pdf-internos/pdf-ruta';
import { ReportesExternoService } from '../services/reportes-externo.service';
import { ReportesInternoService } from '../services/reportes-interno.service';

@Component({
  selector: 'app-reporte-ficha',
  templateUrl: './reporte-ficha.component.html',
  styleUrls: ['./reporte-ficha.component.css']
})
export class ReporteFichaComponent implements OnInit {
  alterno_externo: string
  alterno_interno: string
  constructor(
    private reporteService: ReportesExternoService,
    private authService: AuthService,
    private reporteInternoService: ReportesInternoService) { }

  ngOnInit(): void {
  }

  generar_reporte() {
    if (this.alterno_externo) {
      this.alterno_externo.trim()
      this.reporteService.getReporteFicha(this.alterno_externo).subscribe(data => {
        HojaFicha(data.tramite, data.workflow, this.authService.Account.funcionario.nombre_completo)
      })
    }
    else {
      Swal.fire('Ingrese el alterno del tramite externo', undefined, 'info')
    }
  }
  generar_reporte_interno() {
    if (this.alterno_interno) {
      this.alterno_interno.trim()
      this.reporteInternoService.getReporteFicha(this.alterno_interno).subscribe(data => {
        HojaFichaInterna(data.tramite, data.workflow, this.authService.Account.funcionario.nombre_completo)
      })
    }
    else {
      Swal.fire('Ingrese el alterno del tramite INterno', undefined, 'info')
    }
  }

  generar_reportePrueba() {
    if (this.alterno_externo) {
      this.alterno_externo.trim()
      this.reporteService.getReporteRuta(this.alterno_externo).subscribe(data => {
        HojaRutaDetalles(data.tramite, data.workflow, this.authService.Account.funcionario.nombre_completo)
      })
    }
    else {
      Swal.fire('Ingrese el alterno del tramite externo', undefined, 'info')
    }
  }
  generar_reportePrueba2() {
    if (this.alterno_interno) {
      this.alterno_interno.trim()
      this.reporteInternoService.getReporteRuta(this.alterno_interno).subscribe(data => {
        HojaRutaInternaDetalles(data.tramite, data.workflow, this.authService.Account.funcionario.nombre_completo)
      })
    }
    else {
      Swal.fire('Ingrese el alterno del tramite externo', undefined, 'info')
    }
  }

}
