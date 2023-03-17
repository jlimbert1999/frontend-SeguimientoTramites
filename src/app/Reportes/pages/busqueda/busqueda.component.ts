import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ExternosService } from 'src/app/Externos/services/externos.service';
import { InternosService } from 'src/app/Internos/services/internos.service';
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
    tipo_tramite: null
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
  lengthData: number = 0

  constructor(
    private fb: FormBuilder,
    private externoService: ExternosService,
    private internoService: InternosService,
    public reporteService: ReporteService) {



  }
  ngOnInit(): void {

    // if(this.reporteService.)
  }


  selectTypeSearch(type: 'INTERNO' | 'EXTERNO') {
    this.reporteService.grupo = type
    this.tipos = []
    this.dataSource = []
    if (type === 'EXTERNO') {
      this.displayedColumns = ['alterno', 'descripcion', 'estado', 'solicitante', 'fecha_registro', 'opciones'];
      this.externoService.getGroups().subscribe(data => {
        this.segmentos = data
      })
    }
    else {
      this.displayedColumns = ['alterno', 'detalle', 'solicitante', 'destinatario', 'estado', 'cite', 'fecha', 'opciones']
      this.internoService.getTypes().subscribe(data => {
        this.tipos = data
      })

    }
  }

  getTypes(segmento: string) {
    this.externoService.getTypes(segmento).subscribe(data => {
      this.tipos = data
    })
  }

  searchExternos() {
    this.campos = []
    this.reporteService.params = new HttpParams()
    for (const [key, value] of Object.entries(this.searchForm.value)) {
      if (value !== null && value != "") {
        this.reporteService.params = this.reporteService.params.append(key, value);
        if (key === 'tipo_tramite') {
          const type_tramite = this.tipos.find(tipo => tipo.id_tipoTramite == value)
          this.campos.push(['Tipo de tramite', type_tramite.nombre])
        }
        else {
          this.campos.push([key, value])
        }
      }
    }
    if (this.reporteService.grupo && this.reporteService.params.keys().length > 0) {
      this.reporteService.getReporteSearch().subscribe(data => {
        this.dataSource = data.tramites
        this.lengthData = data.length
      })
    }
  }
  get Group() {
    return this.reporteService.grupo
  }
  set fva(valor: 'INTERNO' | 'EXTERNO') {
    this.reporteService.grupo = valor
  }
  reset() {
    this.dataSource = []
    this.lengthData = 0
    this.searchForm.reset()
  }
  generatePDF() {
    if (this.campos.length > 0) {
      Swal.fire({
        title: 'Generando reporte....',
        text: `Numero de registros: ${this.lengthData}. Por favor espere`,
        allowOutsideClick: false,
      });
      Swal.showLoading();
      this.reporteService.getReporteSearchNotPaginated(this.reporteService.grupo, this.lengthData).subscribe(tramites => {
        PDF_busqueda('jose limbert', this.reporteService.grupo, this.campos, tramites, this.lengthData)
        Swal.close()
      })
    }

  }
  pagination(page: PageEvent) {
    this.reporteService.offset = page.pageIndex
    this.reporteService.limit = page.pageSize
    this.reporteService.getReporteSearch().subscribe(data => {
      this.dataSource = data.tramites
      this.lengthData = data.length
    })
  }
}
