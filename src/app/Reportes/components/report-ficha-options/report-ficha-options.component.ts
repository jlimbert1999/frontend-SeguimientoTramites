import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { statesProcedure } from 'src/app/procedures/models/ProceduresProperties';
import { SendDataReportEvent } from '../../models/sendData.model';

@Component({
  selector: 'app-report-ficha-options',
  templateUrl: './report-ficha-options.component.html',
  styleUrls: ['./report-ficha-options.component.scss']
})
export class ReportFichaOptionsComponent implements OnInit {
  @Output() sendDataEvent = new EventEmitter<SendDataReportEvent>();
  groupProcedure: any = 'tramites_externos'
  options = this._formBuilder.group({
    alterno: null,
    estado: null,
    detalle: null,
    cite: null,
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  states: statesProcedure

  constructor(private reporteService: ReporteService, private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {

  }


  generateReport() {
    this.reporteService.getReporteFicha(this.groupProcedure, this.options.value).subscribe(data => {
      this.sendDataEvent.emit({ data, group: this.groupProcedure, params: this.options.value, title: 'FICHA' })
    })
  }

}
