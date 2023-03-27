import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ExternosService } from 'src/app/Tramites/services/externos.service';
import Swal from 'sweetalert2';
import { PDF_FichaExterno } from '../../pdf/reporte-ficha';
import { PDF_Solicitante } from '../../pdf/reporte-solicitante';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-solicitante',
  templateUrl: './solicitante.component.html',
  styleUrls: ['./solicitante.component.css'],
  animations: [
    fadeInOnEnterAnimation(),
  ]
})
export class SolicitanteComponent {
  params: any = {}
  searchFormSolicitante = this.fb.group({

    dni: null,
    nombre: [null, Validators.minLength(3)],
    paterno: [null, Validators.minLength(3)],
    materno: [null, Validators.minLength(3)]
  });
  searchFormRepresentante = this.fb.group({
    dni: null,
    nombre: null,
    paterno: null,
    materno: null,
  });
  data: any[] = []
  displayedColumns = [
    { key: 'alterno', titulo: 'Alterno' },
    { key: 'detalle', titulo: 'Detalle' },
    { key: 'estado', titulo: 'Estado' },
    { key: 'fecha_registro', titulo: 'Fecha' }
  ];
  constructor(private fb: FormBuilder, private reporteService: ReporteService, private externoService: ExternosService) { }

  getReporteSolicitante() {
    if (this.searchFormSolicitante.invalid) {
      return
    }
    this.data = []
    Swal.fire({
      title: 'Generando reporte....',
      text: `Por favor espere`,
      allowOutsideClick: false,
    });
    Swal.showLoading();
    for (const [key, value] of Object.entries(this.searchFormSolicitante.value)) {
      if (value !== null && value != "") {
        Object.assign(this.params, { [key]: value })
      }
    }
    if (Object.keys(this.params).length > 0) {
      this.reporteService.getReporteSolicitante(this.params).subscribe(data => {

        Swal.close()
        this.data = data
      })
    }
  }
  getReporteRepresentante() {
    Swal.fire({
      title: 'Generando reporte....',
      text: `Por favor espere`,
      allowOutsideClick: false,
    });
    Swal.showLoading();
    let parametros = {}
    for (const [key, value] of Object.entries(this.searchFormSolicitante.value)) {
      if (value !== null && value != "") {
        Object.assign(parametros, { [key]: value })
      }
    }
    if (Object.keys(parametros).length > 0) {
      this.reporteService.getReporteRepresentante(parametros).subscribe(data => {
        PDF_Solicitante('JOSE', parametros, data)
        Swal.close()
      })
    }
  }

  generateFicha(id_tramite: string) {
    this.externoService.getOne(id_tramite).subscribe(data => {
      PDF_FichaExterno(data.tramite, data.workflow, 'jose')
    })
  }
  generateReporte() {
    PDF_Solicitante('JOSE', this.params, this.data)
  }
}
