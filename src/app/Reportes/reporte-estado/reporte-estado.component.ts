import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BandejaService } from 'src/app/Tramites/services/bandeja.service';
import { HojaEstado } from '../pdf/pdf-estado';
import { ReportesExternoService } from '../services/reportes-externo.service';

@Component({
  selector: 'app-reporte-estado',
  templateUrl: './reporte-estado.component.html',
  styleUrls: ['./reporte-estado.component.css']
})
export class ReporteEstadoComponent implements OnInit {
  instituciones: any[] = []
  estados: string[] = [
    'INSCRITO',
    'OBSERVADO',
    'EN REVISION',
    'CONCLUIDO'
  ]
  FormReporte: FormGroup = this.fb.group({
    institucion: ['', Validators.required],
    estado: ['', Validators.required],
    fecha_inicial: ['', Validators.required],
    fecha_final: ['', Validators.required]
  });
  constructor(
    private fb: FormBuilder,
    private reporteService: ReportesExternoService,
    private bandejaService: BandejaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.bandejaService.obtener_instituciones_envio().subscribe(inst => {
      this.instituciones = inst
    })
  }
  generarReporte() {
    this.reporteService.getReporteEstado(
      this.FormReporte.get('estado')?.value,
      this.FormReporte.get('institucion')?.value,
      moment(this.FormReporte.get('fecha_inicial')?.value).toDate(),
      moment(this.FormReporte.get('fecha_final')?.value).add(1, 'days').toDate()
    ).subscribe(tramites => {
      HojaEstado(tramites, this.FormReporte.get('estado')?.value, this.authService.Detalles_Cuenta.funcionario)
    })


  }


}
