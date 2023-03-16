import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ExternosService } from 'src/app/Externos/services/externos.service';
import { InternosService } from 'src/app/Internos/services/internos.service';
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
export class BusquedaComponent {
  grupo: 'INTERNO' | 'EXTERNO'
  tipos: any[] = []
  params = new HttpParams()
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
    private reporteService: ReporteService) { }


  selectTypeSearch(type: 'INTERNO' | 'EXTERNO') {
    this.grupo = type
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
    this.params = new HttpParams()
    for (const [key, value] of Object.entries(this.searchForm.value)) {
      if (value !== null && value != "") {
        this.params = this.params.append(key, value);
        if (key === 'tipo_tramite') {
          const type_tramite = this.tipos.find(tipo => tipo.id_tipoTramite == value)
          this.campos.push(['Tipo de tramite', type_tramite.nombre])
        }
        else {
          this.campos.push([key, value])
        }
      }
    }
    if (this.grupo) {
      this.reporteService.getReporteSearch(this.params, this.grupo).subscribe(data => {
        this.dataSource = data.tramites
        this.lengthData = data.length
      })
    }
  }
  reset() {
    this.dataSource = []
    this.lengthData = 0
    this.searchForm.reset()
  }
  generatePDF() {
    if (this.campos.length > 0) {
      this.reporteService.getReporteSearchNotPaginated(this.params, this.grupo, this.lengthData).subscribe(tramites => {
        console.log(tramites)
        PDF_busqueda('jose limbert', this.grupo, this.campos, tramites, this.lengthData)
      })
    }

  }
}
