import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';
import * as moment from 'moment';

@Component({
  selector: 'app-report-solicitante-options',
  templateUrl: './report-solicitante-options.component.html',
  styleUrls: ['./report-solicitante-options.component.css']
})
export class ReportSolicitanteOptionsComponent {
  @Output() sendDataEvent = new EventEmitter<any>();

  searchFormSolicitante = this.fb.group({
    dni: [null],
    nombre: [null, Validators.minLength(3)],
    paterno: [null, Validators.minLength(3)],
    materno: [null, Validators.minLength(3)],
    telefono: [null, Validators.minLength(3)]
  });
  searchFormRepresentante = this.fb.group({
    dni: null,
    nombre: [null, Validators.minLength(3)],
    paterno: [null, Validators.minLength(3)],
    materno: [null, Validators.minLength(3)],
    telefono: [null, Validators.minLength(3)]
  });

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });




  constructor(private fb: FormBuilder, private reporteService: ReporteService) {

  }

  getReporteSolicitante() {
    let params = {}
    for (const [key, value] of Object.entries(this.searchFormSolicitante.value)) {
      if (value !== null && value != "") {
        Object.assign(params, { [key]: value })
      }
    }
    if (Object.keys(params).length === 0 || this.searchFormSolicitante.invalid) return
    if (this.range.get('start')?.value) Object.assign(params, { start: this.range.get('start')?.value!.toISOString() })
    if (this.range.get('end')?.value) Object.assign(params, { end: this.range.get('end')?.value!.toISOString() })
    this.reporteService.getReporteSolicitante(params).subscribe(data => {
      this.sendDataEvent.emit({
        data,
        typeTramiteForReport: 'externo',
        paramsForSearch: params
      })
    })
  }

  getReporteRepresentante() {
    let params = {}
    for (const [key, value] of Object.entries(this.searchFormRepresentante.value)) {
      if (value !== null && value != "") {
        Object.assign(params, { [key]: value })
      }
    }
    if (Object.keys(params).length === 0 || this.searchFormRepresentante.invalid) return
    this.reporteService.getReporteRepresentante(params, this.range.get('start')?.value!, this.range.get('end')?.value!).subscribe(data => {
      this.sendDataEvent.emit({ data, typeTramiteForReport: 'externo' })
    })
  }
}
