import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ReporteService } from '../../services/reporte.service';
import { Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { paramsNavigation, statesProcedure } from 'src/app/procedures/models/ProceduresProperties';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.scss'],
  animations: [
    fadeInOnEnterAnimation()
  ]
})

export class BusquedaComponent implements OnInit {
  groupProcedure: any = 'tramites_externos'
  searchForm: FormGroup = this.createForm(this.groupProcedure)
  states: statesProcedure[] = [
    'CONCLUIDO',
    'EN REVISION',
    'INSCRITO',
    'OBSERVADO'
  ]
  typesProcedures: any[] = []
  institutions: any[] = []
  dependencies: any[] = []
  accounts: any[] = []
  @ViewChild(MatAccordion) accordion: MatAccordion;

  displayedColumns: string[] = ['alterno', 'descripcion', 'estado', 'fecha_registro', 'opciones'];
  colums: { key: string, titulo: string }[] = [
    { key: 'alterno', titulo: 'Alterno' },
    { key: 'detalle', titulo: 'Detalle' },
    { key: 'estado', titulo: 'Estado' },
    { key: 'remitente', titulo: 'Remitente' },
    { key: 'destinatario', titulo: 'Remitente' },
    { key: 'cite', titulo: 'Cite' },
    { key: 'fecha_registro', titulo: 'Fecha' }
  ]
  dataSource: any[] = []




  constructor(
    private fb: FormBuilder,
    public reporteService: ReporteService,
    private router: Router,
    public paginationService: PaginatorService
  ) {

  }
  ngOnInit(): void {
    forkJoin([
      this.reporteService.getInstitucionesForReports(),
      this.reporteService.getTypesProceduresForReports(this.groupProcedure)
    ]).subscribe(data => {
      this.institutions = data[0]
      this.typesProcedures = data[1]
    })
  }



  view(procedure: any) {
    let params: paramsNavigation = {
      limit: this.paginationService.limit,
      offset: this.paginationService.offset
    }
    this.router.navigate([`home/reportes/busquedas/${this.groupProcedure === 'tramites_externos' ? 'ficha-externa' : 'ficha-interna'}`, procedure._id], { queryParams: params })
  }


  generateReport() {
    this.reporteService.getReporteBySearch(this.groupProcedure, this.searchForm.value, this.paginationService.limit, this.paginationService.offset).subscribe((data => {
      this.dataSource = [...data.procedures]
      this.paginationService.length = data.length
    }))
  }
  createForm(group: any) {
    return group === 'tramites_externos'
      ? this.fb.group({
        alterno: null,
        cite: null,
        detalle: null,
        solicitante: null,
        representante: null,
        tipo_tramite: null,
        estado: null,
        // dependencia: null,
        // institucion: null,
        // cuents: null,
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      })
      : this.fb.group({
        alterno: null,
        cite: null,
        detalle: null,
        remitente: null,
        destinatario: null,
        tipo_tramite: null,
        estado: null,
        // dependencia: null,
        // institucion: null,
        // cuents: null,
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      })
  }
  selectGroupProcedure(group: any) {
    this.searchForm = this.createForm(this.groupProcedure)
    this.reporteService.getTypesProceduresForReports(group).subscribe(data => {
      this.typesProcedures = data
    })
  }
  selectTypeProcedure(type: any) {
    this.searchForm.get('tipo_tramite')?.setValue(type.id_tipoTramite)
  }

  selectInstitution(id_institucion: string) {
    this.reporteService.getDependenciasForReports(id_institucion).subscribe(dependencias => {
      this.dependencies = dependencias
    })
  }
  selectDependencia(dependence: any) {
    this.searchForm.get('dependencia')?.setValue(dependence.id_dependencia)
    this.reporteService.getUsersForReports(dependence.id_dependencia).subscribe(accounts => {
      this.accounts = accounts
    })
  }
  selectUser(account: any) {
    this.searchForm.get('cuenta')?.setValue(account._id)
  }
  reset() {
    this.searchForm.reset()
  }

}
