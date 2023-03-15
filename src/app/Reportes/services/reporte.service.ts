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

  constructor(private http: HttpClient) { }
  getReporteFicha(alterno: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: WorkflowData[], tipo: 'tramites_internos' | 'tramites_externos' }>(`${base_url}/reportes/ficha/${alterno}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow, tipo: resp.tipo }
      })
    )
  }
  getReporteSearch(params: HttpParams) {
    return this.http.get<{ ok: boolean, tramites:any }>(`${base_url}/reportes/busqueda/23`, {params}).pipe(
      map(resp => {
        return resp.tramites
      })
    )

  }
}
