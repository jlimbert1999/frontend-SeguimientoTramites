import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-report-solicitante-options',
  templateUrl: './report-solicitante-options.component.html',
  styleUrls: ['./report-solicitante-options.component.css']
})
export class ReportSolicitanteOptionsComponent {
  @Output() dataOutput = new EventEmitter<any[]>();
  params: any = {}
  searchFormSolicitante = this.fb.group({
    dni: [null],
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
  data: never[];
  panelOpenState = false;

  constructor(private fb: FormBuilder, private reporteService: ReporteService) { }

  getReporteSolicitante() {
    this.params = {}
    for (const [key, value] of Object.entries(this.searchFormSolicitante.value)) {
      if (value !== null && value != "") {
        Object.assign(this.params, { [key]: value })
      }
    }
    if (Object.keys(this.params).length === 0 || this.searchFormSolicitante.invalid) {
      return
    }
    this.reporteService.getReporteSolicitante(this.params).subscribe(data => {
      this.dataOutput.emit(data)
    })

  }
  getReporteRepresentante() {
    this.params = {}
    for (const [key, value] of Object.entries(this.searchFormRepresentante.value)) {
      if (value !== null && value != "") {
        Object.assign(this.params, { [key]: value })
      }
    }
    if (Object.keys(this.params).length === 0 || this.searchFormRepresentante.invalid) {
      return
    }
    this.reporteService.getReporteRepresentante(this.params).subscribe(data => {
      this.dataOutput.emit(data)
    })
  }
}
