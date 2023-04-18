import { Component, EventEmitter, Output } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { FormControl, FormGroup } from '@angular/forms';
import { group } from 'src/app/shared/models/group.model';
import { SendDataReportEvent } from '../../models/sendData.model';

@Component({
  selector: 'app-report-usuario-options',
  templateUrl: './report-usuario-options.component.html',
  styleUrls: ['./report-usuario-options.component.css']
})
export class ReportUsuarioOptionsComponent {
  @Output() sendDataEvent = new EventEmitter<SendDataReportEvent>();
  accounts: any[] = []
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  states: string[] = [
    'INSCRITO',
    'OBSERVADO',
    'CONCLUIDO',
    'EN REVISION'
  ]
  id_cuenta: string
  paramsSearch: any = {
    estado: null,
    group: 'tramites_externos'
  }

  constructor(private reporteService: ReporteService) {


  }

  getAccounts(text: string) {
    this.reporteService.getAccountsByText(text).subscribe(accounts => {
      this.accounts = accounts
    })
  }

  selectAccount(data: any) {
    this.id_cuenta = data._id
   
  }
  generateReport() {
    Object.assign(this.paramsSearch, { start: this.range.get('start')?.value?.toISOString() })
    Object.assign(this.paramsSearch, { end: this.range.get('end')?.value?.toISOString() })
    Object.entries(this.paramsSearch).forEach(o => {
      if (!o[1]) {
        delete this.paramsSearch[o[0]]
      }
    });
    this.reporteService.getProceduresOfAccount(this.id_cuenta, this.paramsSearch).subscribe(procedures => {
      console.log(procedures);

    })


  }

}
