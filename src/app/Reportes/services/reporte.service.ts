import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Externo } from 'src/app/Tramites/models/Externo.interface';
import { WorkflowData } from 'src/app/Bandejas/models/workflow.interface';
import { Interno } from 'src/app/Tramites/models/Interno.interface';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  limit: number = 10
  offset: number = 0
  length: number = 0
  grupo: 'INTERNO' | 'EXTERNO'
  params: HttpParams
  searchParams: any = {}

  constructor(private http: HttpClient) { }
  getReporteFicha(alterno: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: WorkflowData[], tipo: 'tramites_internos' | 'tramites_externos' }>(`${base_url}/reportes/ficha/${alterno}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow, tipo: resp.tipo }
      })
    )
  }
  getReporteSearch() {
    this.params = new HttpParams({ fromObject: this.searchParams })
    this.params = this.params.set('limit', this.limit)
    this.params = this.params.set('offset', this.offset)
    return this.http.get<{ ok: boolean, tramites: any, length: number }>(`${base_url}/reportes/busqueda/${this.grupo}`, { params: this.params }).pipe(
      map(resp => {
        this.length = resp.length
        console.log(resp.tramites)
        return resp.tramites
      })
    ) 
  }
  getReporteSearchNotPaginated(grupo: 'INTERNO' | 'EXTERNO', length: number) {
    return this.http.get<{ ok: boolean, tramites: | Externo[] | Interno[] }>(`${base_url}/reportes/busqueda/${grupo}?limit=${length}&offset=0`, { params: this.params }).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }


  getReporteSolicitante(parametros: any) {
    return this.http.post<{ ok: boolean, tramites: any[] }>(`${base_url}/reportes/solicitante`, parametros).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
  getReporteRepresentante(parametros: any) {
    return this.http.post<{ ok: boolean, tramites: any[] }>(`${base_url}/reportes/representante`, parametros).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
}
