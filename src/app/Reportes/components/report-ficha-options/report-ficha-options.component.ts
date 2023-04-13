import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { FormControl, Validators } from '@angular/forms';

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

  typeTramiteForReport: 'interno' | 'externo' = 'externo'
  alterno = new FormControl('', [Validators.required, Validators.minLength(4)]);

  constructor(private reporteService: ReporteService) {

  }

  ngOnInit(): void {
    console.log(this.someInput)
  }


  generateReport() {
    this.reporteService.getReporteFicha(this.alterno.value!, this.typeTramiteForReport).subscribe(data => {
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
