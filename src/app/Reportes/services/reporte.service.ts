import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WorkflowData } from 'src/app/Externos/models/Externo.interface';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  limit: number = 0
  offset: number = 10

  constructor(private http: HttpClient) { }
  getReporteFicha(alterno: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: WorkflowData[], tipo: 'tramites_internos' | 'tramites_externos' }>(`${base_url}/reportes/ficha/${alterno}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow, tipo: resp.tipo }
      })
    )
  }
  getReporteSearch(params: HttpParams, grupo: 'INTERNO' | 'EXTERNO') {
    params = params.append('limit', this.limit)
    params = params.append('offset', this.offset)
    console.log(params)
    return this.http.get<{ ok: boolean, tramites: any, length: number }>(`${base_url}/reportes/busqueda/${grupo}`, { params }).pipe(
      map(resp => {
        return { tramites: resp.tramites, length: resp.length }
      })
    )
  }
  getReporteSearchNotPaginated(params: HttpParams, grupo: 'INTERNO' | 'EXTERNO', length: number) {
    return this.http.get<{ ok: boolean, tramites: any, length: number }>(`${base_url}/reportes/busqueda/${grupo}?limit=${length}&offset=0`, { params }).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }

}
