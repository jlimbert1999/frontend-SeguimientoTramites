import { Component, EventEmitter, Output } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SendDataReportEvent } from '../../models/sendData.model';
import { groupProcedure, statesProcedures } from 'src/app/Tramites/models/ProceduresProperties';

@Component({
  selector: 'app-report-usuario-options',
  templateUrl: './report-usuario-options.component.html',
  styleUrls: ['./report-usuario-options.component.css']
})
export class ReportUsuarioOptionsComponent {
  @Output() sendDataEvent = new EventEmitter<SendDataReportEvent>();
  accounts: any[] = []
  groupProcedure: groupProcedure = 'tramites_externos'
  options = this._formBuilder.group({
    id_cuenta: '',
    estado: null,
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  states = statesProcedures

  constructor(private reporteService: ReporteService, private _formBuilder: FormBuilder) {


  }

  getAccounts(text: string) {
    this.reporteService.getAccountsByText(text).subscribe(accounts => {
      this.accounts = accounts
    })
  }

  selectAccount(data: any) {
    this.options.get('id_cuenta')?.setValue(data._id)
   
  }
  generateReport() {
    const account = this.accounts.find(acc => acc._id === this.options.get('id_cuenta')?.value)
    this.reporteService.getReportByAccount(this.groupProcedure, this.options.value).subscribe(data => {
      this.sendDataEvent.emit({ data, group: this.groupProcedure, params: this.options.value, extras: { account } })
    })
  }
}
