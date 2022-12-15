import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { HojaFicha } from '../pdf/pdf-ficha';
import { HojaRutaDetalles } from '../pdf/pdf-ruta';
import { ReportesExternoService } from '../services/reportes-externo.service';

@Component({
  selector: 'app-reporte-ficha',
  templateUrl: './reporte-ficha.component.html',
  styleUrls: ['./reporte-ficha.component.css']
})
export class ReporteFichaComponent implements OnInit {
  alterno: string
  constructor(private reporteService: ReportesExternoService, private authService: AuthService) { }

  ngOnInit(): void {
  }

  generar_reporte() {
    if (this.alterno) {
      this.alterno.trim()
      this.reporteService.getReporteFicha(this.alterno).subscribe(data => {
        HojaFicha(data.tramite, data.workflow, this.authService.Detalles_Cuenta.funcionario)
      })
    }
    else {
      Swal.fire('Ingrese el alterno', undefined, 'info')
    }

  }
  generar_reportePrueba() {
    if (this.alterno) {
      this.alterno.trim()
      this.reporteService.getReporteRuta(this.alterno).subscribe(data => {
        HojaRutaDetalles(data.tramite, data.workflow, this.authService.Detalles_Cuenta.funcionario)
      })
    }
    else {
      Swal.fire('Ingrese el alterno', undefined, 'info')
    }

  }

}
