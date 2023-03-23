import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { PDF_Solicitante } from '../../pdf/reporte-solicitante';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-solicitante',
  templateUrl: './solicitante.component.html',
  styleUrls: ['./solicitante.component.css']
})
export class SolicitanteComponent {

  searchFormSolicitante = this.fb.group({
    dni: null,
    nombre: null,
    paterno: null,
    materno: null,
  });
  searchFormRepresentante = this.fb.group({
    dni: null,
    nombre: null,
    paterno: null,
    materno: null,
  });
  constructor(private fb: FormBuilder, private reporteService: ReporteService) { }

  getReporteSolicitante() {
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
      this.reporteService.getReporteSolicitante(parametros).subscribe(data => {
        PDF_Solicitante('JOSE', parametros, data)
        Swal.close()
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
}
