import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HojaContribuyentes } from '../pdf-externos/pdf-contribuyente';
import { ReportesExternoService } from '../services/reportes-externo.service';

@Component({
  selector: 'app-reporte-contribuyente',
  templateUrl: './reporte-contribuyente.component.html',
  styleUrls: ['./reporte-contribuyente.component.css']
})
export class ReporteContribuyenteComponent implements OnInit {
  dni: string
  constructor(private reporteService: ReportesExternoService, private authService: AuthService) { }

  ngOnInit(): void {

  }
  generarReporte() {
    this.reporteService.getReporteContribuyente(this.dni).subscribe(tramites => {
      HojaContribuyentes(tramites, this.authService.Account.funcionario.nombre_completo)
    })
  }

}
