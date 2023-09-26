import { Component, EventEmitter, Output } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SendDataReportEvent } from '../../models/sendData.model';
import { stateProcedure } from 'src/app/procedures/interfaces';

@Component({
  selector: 'app-report-usuario-options',
  templateUrl: './report-usuario-options.component.html',
  styleUrls: ['./report-usuario-options.component.scss']
})
export class ReportUsuarioOptionsComponent {
  @Output() sendDataEvent = new EventEmitter<SendDataReportEvent>();
  accounts: any[] = []
  groupProcedure: any = 'tramites_externos'
  options = this._formBuilder.group({
    cuenta: '',
    estado: null,
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  states: stateProcedure

  constructor(private reporteService: ReporteService, private _formBuilder: FormBuilder) {


  }

  getAccounts(text: string) {
    this.reporteService.getAccountsByText(text).subscribe(accounts => {
      this.accounts = accounts
    })
  }

  selectAccount(data: any) {
    this.options.get('cuenta')?.setValue(data._id)

  }
  generateReport() {
    let extraDataPDF = { ...this.options.value }
    const account = this.accounts.find(acc => acc._id == this.options.get('cuenta')?.value)
    extraDataPDF['cuenta'] = account.funcionario.fullname
    this.reporteService.getReportByAccount(this.groupProcedure, this.options.value).subscribe(data => {
      this.sendDataEvent.emit({ data, group: this.groupProcedure, params: extraDataPDF, title: 'USUARIO' })
    })
  }
}
