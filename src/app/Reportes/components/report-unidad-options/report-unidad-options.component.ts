import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { SendDataReportEvent } from '../../models/sendData.model';
import { forkJoin } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { searchParamsReportUnit } from '../../models/repot-unidad.model';
@Component({
  selector: 'app-report-unidad-options',
  templateUrl: './report-unidad-options.component.html',
  styleUrls: ['./report-unidad-options.component.css']
})
export class ReportUnidadOptionsComponent implements OnInit {
  @Output() sendDataEvent = new EventEmitter<SendDataReportEvent>();
  instituciones: any[] = []
  typesProcedures: any[] = []
  dependencias: any[] = []
  accounts: any[] = []
  groupProcedures: 'tramites_externos' | 'tramites_internos' = 'tramites_externos'

  states: string[] = [
    'INSCRITO',
    'OBSERVADO',
    'CONCLUIDO',
    'EN REVISION'
  ]
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  id_institucion: string
  id_dependecia: string
  id_account: string


  searchParams: any = {
    id_institucion: null,
    id_dependencia: null,
    id_cuenta: null,
    id_tipoTramite: null,
    estado: null
  }



  constructor(private reporteService: ReporteService) {

  }
  ngOnInit(): void {
    this.selectGroupProcedure()
  }

  selectGroupProcedure() {
    forkJoin([this.reporteService.getInstitucionesForReports(), this.reporteService.getTypesProceduresForReports(this.groupProcedures)]).subscribe(data => {
      this.instituciones = data[0]
      this.typesProcedures = data[1]
    })
  }

  selectInstitution(id_institucion: string) {
    this.searchParams.id_institucion = id_institucion
    this.reporteService.getDependenciasForReports(id_institucion).subscribe(dependencias => {
      this.dependencias = dependencias
    })
  }
  selectDependencia(dependence: any) {
    this.searchParams.id_dependencia = dependence.id_dependecia
    this.reporteService.getUsersForReports(dependence.id_dependencia).subscribe(accounts => {
      this.accounts = accounts
    })
  }
  selectUser(account: any) {
    this.searchParams.id_cuenta = account._id
  }
  selectTypeProcedure(data: any) {

  }




  generateReport() {

    // const institucion = this.instituciones.find(inst => inst.id_institucion === this.id_institucion)
    // let searchParams = [{ field: 'institucion', value: institucion.nombre }]
    // let s = {}
    // if (this.id_dependecia) {
    //   const dependencia = this.dependencias.find(dep => dep.id_dependencia == this.id_dependecia)
    //   searchParams.push({ field: 'dependencia', value: `${dependencia.nombre}` })
     
    // }
    // if (this.id_account) {
    //   const account = this.accounts.find(account => account._id == this.id_account)
    //   searchParams.push({ field: 'usuario', value: `${account.funcionario.fullname} (${account.funcionario.cargo})` })
    // }
    // this.reporteService.getReportByUnit(this.id_institucion, this.id_dependecia, this.id_account, this.groupProcedures).subscribe(data => {
    //   this.sendDataEvent.emit({ data, group: this.groupProcedures, searchParams })
    // })
  }





}
