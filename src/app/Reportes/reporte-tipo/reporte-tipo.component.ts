import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BandejaService } from 'src/app/Tramites/services/bandeja.service';
import { ExternosService } from 'src/app/Tramites/services/externos.service';
import Swal from 'sweetalert2';
import { HojaTipoTramite } from '../pdf/pdf-TipoTramite';
import { ReportesExternoService } from '../services/reportes-externo.service';

@Component({
  selector: 'app-reporte-tipo',
  templateUrl: './reporte-tipo.component.html',
  styleUrls: ['./reporte-tipo.component.css']
})
export class ReporteTipoComponent implements OnInit {
  instituciones: any[] = []
  tipos_tramites: any[] = []
  nombre_tramite: string


  FormReporte: FormGroup = this.fb.group({
    institucion: ['', Validators.required],
    tipo_tramite: ['', Validators.required],
    fecha_inicial: ['', Validators.required],
    fecha_final: ['', Validators.required]
  });
  constructor(
    private externoService: ExternosService,
    private bandejaService: BandejaService,
    private reporteService: ReportesExternoService,
    private authService: AuthService,
    private fb: FormBuilder) { }
  ngOnInit(): void {
    this.externoService.getTiposTramite().subscribe(tipos => {
      this.tipos_tramites = tipos.tiposTramites

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
      HojaTipoTramite(tramites, this.nombre_tramite, this.authService.Detalles_Cuenta.funcionario)
    })

  }

}
