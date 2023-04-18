import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { fadeInOnEnterAnimation } from 'angular-animations';
import * as moment from 'moment';
import { ExternosService } from 'src/app/Tramites/services/externos.service';
import { InternosService } from 'src/app/Tramites/services/internos.service';
import Swal from 'sweetalert2';
import { PDF_busqueda } from '../../pdf/reporte-busqueda';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'],
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
    estado: null,
    cite: null,
    start: null,
    end: null,
    tipo_tramite: null,
    detalle: null
  });

  hasUnitNumber = false;

  estados = [
    'INSCRITO',
    'EN REVISION',
    'OBSERVADO',
    'CONCLUIDO'
  ]
  displayedColumns: string[] = [];
  dataSource: any[] = []

  constructor(
    private fb: FormBuilder,
    private externoService: ExternosService,
    private internoService: InternosService,
    public reporteService: ReporteService
  ) {
    // if (this.reporteService.grupo === 'EXTERNO') {
    //   this.displayedColumns = ['alterno', 'descripcion', 'estado', 'solicitante', 'fecha_registro', 'opciones'];
    //   this.externoService.getGroups().subscribe(data => {
    //     this.segmentos = data
    //   })
    // }
    // else {
    //   this.displayedColumns = ['alterno', 'detalle', 'solicitante', 'destinatario', 'estado', 'cite', 'fecha', 'opciones']
    //   this.internoService.getTypes().subscribe(data => {
    //     this.tipos = data
    //   })
    // }
  }
  ngOnInit(): void {

    if (Object.keys(this.reporteService.searchParams).length > 0) {
      this.searchForm.patchValue(this.reporteService.searchParams)
      this.reporteService.getReporteSearch().subscribe(data => {
        this.dataSource = data
      })
    }

  }


  selectTypeSearch(type: 'INTERNO' | 'EXTERNO') {
    this.reporteService.grupo = type
    this.tipos = []
    this.dataSource = []
    if (type === 'EXTERNO') {
      // this.displayedColumns = ['alterno', 'descripcion', 'estado', 'solicitante', 'fecha_registro', 'opciones'];
      // this.externoService.getGroups().subscribe(data => {
      //   this.segmentos = data
      // })
    }
    else {
      this.displayedColumns = ['alterno', 'detalle', 'solicitante', 'destinatario', 'estado', 'cite', 'fecha', 'opciones']
      this.internoService.getTypes().subscribe(data => {
        this.tipos = data
      })

    }
  }

  getTypes(segmento: string) {
    // this.externoService.getTypes(segmento).subscribe(data => {
    //   this.tipos = data
    // })
  }

  searchExternos() {
    this.campos = []
    this.reporteService.params = new HttpParams()
    this.reporteService.searchParams = {}
    for (const [key, value] of Object.entries(this.searchForm.value)) {
      if (value !== null && value != "") {
        Object.assign(this.reporteService.searchParams, { [key]: value })
        switch (key) {
          case 'tipo_tramite':
            const type_tramite = this.tipos.find(tipo => tipo.id_tipoTramite == value)
            this.campos.push(['Tipo de tramite', type_tramite.nombre])
            break;
          case 'end':
            this.campos.push(['Fecha fin', moment(value).format('DD-MM-YYYY')])
            break;
          case 'start':
            this.campos.push(['Fecha inicio', moment(value).format('DD-MM-YYYY')])
            break;
          default:
            this.campos.push([key, value])
            break;
        }
      }
    }
    if (this.reporteService.grupo) {
      this.reporteService.getReporteSearch().subscribe(data => {
        this.dataSource = data
      })
    }
  }


  reset() {
    this.dataSource = []
    this.reporteService.length = 0
    this.searchForm.reset()
  }
  generatePDF() {
    if (this.campos.length > 0) {
      Swal.fire({
        title: 'Generando reporte....',
        text: `Numero de registros: ${this.reporteService.length}. Por favor espere`,
        allowOutsideClick: false,
      });
      Swal.showLoading();
      this.reporteService.getReporteSearchNotPaginated(this.reporteService.grupo, this.reporteService.length).subscribe(tramites => {
        PDF_busqueda('jose limbert', this.reporteService.grupo, this.campos, tramites, this.reporteService.length)
        Swal.close()
      })
    }

  }
  pagination(page: PageEvent) {
    this.reporteService.offset = page.pageIndex
    this.reporteService.limit = page.pageSize
    this.reporteService.getReporteSearch().subscribe(data => {
      this.dataSource = data
    })
  }


}
