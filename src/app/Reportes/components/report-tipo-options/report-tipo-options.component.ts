import { Component, EventEmitter, Output } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { SendDataReportEvent } from '../../models/sendData.model';
import { groupProcedure, statesProcedures } from 'src/app/Tramites/models/ProceduresProperties';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-tipo-options',
  templateUrl: './report-tipo-options.component.html',
  styleUrls: ['./report-tipo-options.component.css']
})
export class ReportTipoOptionsComponent {
  @Output() sendDataEvent = new EventEmitter<SendDataReportEvent>();
  groupProcedure: groupProcedure = 'tramites_externos'
  options = this._formBuilder.group({
    tipo_tramite: [null, Validators.required],
    alterno: null,
    estado: null,
    detalle: null,
    cite: null,
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  states = statesProcedures
  typesProcedures: any[] = []
  constructor(private reporteService: ReporteService, private _formBuilder: FormBuilder) {
    this.selectGroupProcedure()
  }
  selectGroupProcedure() {
    this.reporteService.getTypesProceduresForReports(this.groupProcedure).subscribe(data => {
      this.typesProcedures = data
    })
  }

  selectTypeProcedure(type: any) {
    this.options.get('tipo_tramite')?.setValue(type.id_tipoTramite)
  }

  generateReport() {
    let extraDataPDF = { ...this.options.value }
    const type = this.typesProcedures.find(type => type.id_tipoTramite == this.options.get('tipo_tramite')?.value)
    extraDataPDF['tipo_tramite'] = type.nombre
    this.reporteService.getReportByTypeProcedure(this.groupProcedure, this.options.value).subscribe(data => {
      this.sendDataEvent.emit({ data, group: this.groupProcedure, params: extraDataPDF, title: 'TIPO DE TRAMITE' })
    })
  }



}
