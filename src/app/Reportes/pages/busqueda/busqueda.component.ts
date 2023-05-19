import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ReporteService } from '../../services/reporte.service';
import { Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { groupProcedure, statesProcedure } from 'src/app/Tramites/models/ProceduresProperties';
import { PaginatorService } from 'src/app/shared/services/paginator.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.scss'],
  animations: [
    fadeInOnEnterAnimation()
  ]
})

export class BusquedaComponent implements OnInit {

  tipos: any[] = []

  campos: Object[] = []

  segmentos: string[] = []
  searchForm = this.fb.group({
    alterno: null,
    cite: null,
    detalle: null,
    estado: null,
    start: null,
    end: null,
    tipo_tramite: null,
  });

  hasUnitNumber = false;

  estados = [
    'INSCRITO',
    'EN REVISION',
    'OBSERVADO',
    'CONCLUIDO'
  ]
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

  @ViewChild(MatAccordion) accordion: MatAccordion;
  typesProcedures: any[] = []

  groupProcedure: groupProcedure = 'tramites_externos'
  options: FormGroup = this.createForm(this.groupProcedure)
  states: statesProcedure

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  constructor(
    private fb: FormBuilder,
    public reporteService: ReporteService,
    private router: Router,
    private _formBuilder: FormBuilder,
    public paginationService: PaginatorService
  ) {

  }
  ngOnInit(): void {
    if (Object.keys(this.paginationService.reportParams).length > 0) {
      this.options.patchValue(this.paginationService.reportParams)
    }
  }



  View(id: string) {
    this.router.navigate(['home/reportes/busquedas/ficha-externa', id])
  }

  selectGroupProcedure(group:groupProcedure) {
    this.createForm(this.groupProcedure)
    this.reporteService.getTypesProceduresForReports(group).subscribe(data => {
      console.log(data);
      this.typesProcedures = data
    })
  }
  selectTypeProcedure(type: any) {
    this.options.get('tipo_tramite')?.setValue(type.id_tipoTramite)
  }

  generateReport() {
    this.reporteService.getReporteBySearch(this.groupProcedure, this.options.value, this.paginationService.limit, this.paginationService.offset).subscribe((data => {
      this.dataSource = [...data.procedures]
      this.paginationService.length = data.length
    }))
  }
  createForm(group: groupProcedure): FormGroup {
    return group === 'tramites_externos'
      ? this._formBuilder.group({
        alterno: null,
        cite: null,
        detalle: null,
        solicitante: null,
        representante: null,
        tipo_tramite: null,
        estado: null,
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      })
      : this._formBuilder.group({
        alterno: null,
        cite: null,
        detalle: null,
        remitente: null,
        destinatario: null,
        tipo_tramite: null,
        estado: null,
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      })
  }
}
