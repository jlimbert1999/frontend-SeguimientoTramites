import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { SendDataReportEvent } from '../../models/sendData.model';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { searchParamsReportUnit } from '../../models/repot-unidad.model';
import { groupProcedure, statesProcedures } from 'src/app/Tramites/models/ProceduresProperties';
@Component({
  selector: 'app-report-unidad-options',
  templateUrl: './report-unidad-options.component.html',
  styleUrls: ['./report-unidad-options.component.css']
})
export class ReportUnidadOptionsComponent implements OnInit {
  @Output() sendDataEvent = new EventEmitter<SendDataReportEvent>();
  institutions: any[] = []
  typesProcedures: any[] = []
  dependencias: any[] = []
  accounts: any[] = []
  groupProcedure: groupProcedure = 'tramites_externos'
  options = this._formBuilder.group({
    institucion: null,
    dependencia: null,
    cuenta: null,
    tipo_tramite: null,
    estado: null,
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  states = statesProcedures



  constructor(private reporteService: ReporteService, private _formBuilder: FormBuilder) {

  }
  ngOnInit(): void {
    this.selectGroupProcedure()
  }

  selectGroupProcedure() {
    forkJoin([this.reporteService.getInstitucionesForReports(), this.reporteService.getTypesProceduresForReports(this.groupProcedure)]).subscribe(data => {
      this.institutions = data[0]
      this.typesProcedures = data[1]
    })
  }

  selectInstitution(id_institucion: string) {
    this.reporteService.getDependenciasForReports(id_institucion).subscribe(dependencias => {
      this.dependencias = dependencias
    })
  }
  selectDependencia(dependence: any) {
    this.options.get('dependencia')?.setValue(dependence.id_dependencia)
    this.reporteService.getUsersForReports(dependence.id_dependencia).subscribe(accounts => {
      this.accounts = accounts
    })
  }
  selectUser(account: any) {
    this.options.get('cuenta')?.setValue(account._id)
  }
  selectTypeProcedure(type: any) {
    this.options.get('tipo_tramite')?.setValue(type.id_tipoTramite)
  }

  generateReport() {
    let extras = this.options.value
    // Object.keys(extras).forEach(key => {
    //   switch (key) {
    //     case 'institucion':
    //       extras[key] = this.institutions.find(inst => inst.id_institucion === this.options.get('institucion'))
    //       break;
    //     case 'dependencia':
    //       extras[key] = this.dependencias.find(dep => dep.id_dependencia === this.options.get('dependencia'))
    //       break;
    //     case 'cuenta':
    //       extras[key] = this.accounts.find(acc => acc._id === this.options.get('cuenta'))
    //       break;
    //     case 'tipo_tramite':
    //       extras[key] = this.accounts.find(type => type.id_tipoTramite === this.options.get('tipo_tramite'))
    //       break;
    //     default:
    //       break;
    //   }
    // })
    console.log(this.options.value);
    // console.log(extras);
    // this.reporteService.getReportByUnit(this.groupProcedure, this.options.value).subscribe(data => {
    //   this.sendDataEvent.emit({ data, group: this.groupProcedure, params: this.options.value, extras: {} })
    // })
  }





}
