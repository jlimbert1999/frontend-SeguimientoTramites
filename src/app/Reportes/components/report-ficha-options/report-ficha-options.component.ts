import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { groupProcedure, statesProcedures } from 'src/app/Tramites/models/ProceduresProperties';

@Component({
  selector: 'app-report-ficha-options',
  templateUrl: './report-ficha-options.component.html',
  styleUrls: ['./report-ficha-options.component.css']
})
export class ReportFichaOptionsComponent implements OnInit {

  @Input()
  someInput: string;

  @Output()
  dataOutput = new EventEmitter<string>();

  typeTramiteForReport: groupProcedure = 'tramites_externos'
  alterno = new FormControl('', [Validators.required, Validators.minLength(4)]);

  options = this._formBuilder.group({
    alterno: null,
    estado: null,
    detalle: null,
    cite: null,
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  states = statesProcedures

  constructor(private reporteService: ReporteService, private _formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    console.log(this.someInput)
  }


  generateReport() {
    this.reporteService.getReporteFicha(this.typeTramiteForReport, this.options.value).subscribe(data => {
      this.dataOutput.emit(data)
    })
  }

  getErrorMessage() {
    if (this.alterno.hasError('required')) {
      return 'El alterno es requerido';
    }
    return this.alterno.hasError('minlength') ? 'Debe ingresar al menos 4 caracteres' : '';
  }


}
