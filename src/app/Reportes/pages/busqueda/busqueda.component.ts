import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ExternosService } from 'src/app/Externos/services/externos.service';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent {
  grupo: 'INTERNO' | 'EXTERNO'
  tipos: any[] = []

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

  constructor(
    private fb: FormBuilder,
    private externoService: ExternosService,
    private reporteService: ReporteService) { }

  onSubmit(): void {
    alert('Thanks!');
  }

  selectTypeSearch(type: 'INTERNO' | 'EXTERNO') {
    this.grupo = type
    if (type === 'EXTERNO') {
      this.externoService.getGroups().subscribe(data => {
        this.segmentos = data
      })
    }
    else {

    }
  }

  getTypes(segmento: string) {
    this.externoService.getTypes(segmento).subscribe(data => {
      this.tipos = data
    })
  }

  searchExternos() {
    const values: any = { ...this.searchForm.value }
    let params = new HttpParams()
    Object.keys(values).forEach(function (key) {
      if (values[key] !== null && values[key] != "") {
        params = params.append(key, values[key]);
      }
    });
    this.reporteService.getReporteSearch(params).subscribe(tramites => {
      console.log(tramites)
    })
  }
}
