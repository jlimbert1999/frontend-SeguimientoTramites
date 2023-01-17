import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BandejaService } from 'src/app/Tramites/services/bandeja.service';
import { ExternosService } from 'src/app/Tramites/services/externos.service';
import { InternosService } from 'src/app/Tramites/services/internos.service';
import Swal from 'sweetalert2';
import { HojaTipoTramite } from '../pdf-externos/pdf-TipoTramite';
import { HojaTipoTramiteInterno } from '../pdf-internos/pdf-TipoTramite';
import { ReportesExternoService } from '../services/reportes-externo.service';
import { ReportesInternoService } from '../services/reportes-interno.service';

@Component({
  selector: 'app-reporte-tipo',
  templateUrl: './reporte-tipo.component.html',
  styleUrls: ['./reporte-tipo.component.css']
})
export class ReporteTipoComponent implements OnInit {
  instituciones: any[] = []
  tipos_tramites: any[] = []
  nombre_tramite: string

  tipos_tramites_interno: any[] = []
  nombre_tramite_interno: string

  FormReporte: FormGroup = this.fb.group({
    institucion: ['', Validators.required],
    tipo_tramite: ['', Validators.required],
    fecha_inicial: ['', Validators.required],
    fecha_final: ['', Validators.required]
  });
  FormReporteInterno: FormGroup = this.fb.group({
    institucion: ['', Validators.required],
    tipo_tramite: ['', Validators.required],
    fecha_inicial: ['', Validators.required],
    fecha_final: ['', Validators.required]
  });
  constructor(
    private externoService: ExternosService,
    private internoService: InternosService,
    private bandejaService: BandejaService,
    private reporteService: ReportesExternoService,
    private reporteInternoService: ReportesInternoService,
    private authService: AuthService,
    private fb: FormBuilder) { }
  ngOnInit(): void {
    this.reporteService.getNamesOfTypes().subscribe(tipos => {
      this.tipos_tramites = tipos
    })
    this.internoService.getTiposTramite().subscribe(tipos => {
      this.tipos_tramites_interno = tipos
    })
    this.bandejaService.obtener_instituciones_envio().subscribe(inst => {
      this.instituciones = inst
    })
  }

  generarReporte() {
    this.reporteService.getReporteTipoTramite(
      this.FormReporte.get('institucion')?.value,
      this.FormReporte.get('tipo_tramite')?.value,
      moment(this.FormReporte.get('fecha_inicial')?.value).toDate(),
      moment(this.FormReporte.get('fecha_final')?.value).add(1, 'days').toDate()
    ).subscribe(tramites => {
      HojaTipoTramite(tramites, this.nombre_tramite, this.authService.Account.funcionario.nombre_completo)
    })

  }

  generarReporteInterno() {
    this.reporteInternoService.getReporteTipoTramite(
      this.FormReporteInterno.get('institucion')?.value,
      this.FormReporteInterno.get('tipo_tramite')?.value,
      moment(this.FormReporteInterno.get('fecha_inicial')?.value).toDate(),
      moment(this.FormReporteInterno.get('fecha_final')?.value).add(1, 'days').toDate()
    ).subscribe(tramites => {
      HojaTipoTramiteInterno(tramites, this.nombre_tramite_interno, this.authService.Account.funcionario.nombre_completo)
    })
  }
}
