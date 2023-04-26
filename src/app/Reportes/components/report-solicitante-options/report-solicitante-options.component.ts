import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';
import { SendDataReportEvent } from '../../models/sendData.model';

@Component({
  selector: 'app-report-solicitante-options',
  templateUrl: './report-solicitante-options.component.html',
  styleUrls: ['./report-solicitante-options.component.css']
})
export class ReportSolicitanteOptionsComponent {
  @Output() sendDataEvent = new EventEmitter<SendDataReportEvent>();


  options = this._formBuilder.group({
    dni: [null, [Validators.minLength(5), Validators.pattern("^[0-9]*$")]],
    nombre: [null, Validators.minLength(3)],
    paterno: [null, Validators.minLength(3)],
    materno: [null, Validators.minLength(3)],
    telefono: [null, Validators.minLength(3)]
  });

  constructor(private _formBuilder: FormBuilder, private reporteService: ReporteService) {
  }

  getReporteSolicitante() {
    this.reporteService.getReportByPetitioner(this.options.value).subscribe(data => {
      this.sendDataEvent.emit({ data, group: 'tramites_externos', params: this.options.value, title:'SOLICITANTE' })
    })
  }

  getErrorDniMessage() {
    if (this.options.get('dni')?.hasError('pattern')) {
      return 'Solo numeros';
    }
    return this.options.get('dni')?.hasError('minlength') ? 'Ingrese al menos 5 caracteres' : '';
  }


}
