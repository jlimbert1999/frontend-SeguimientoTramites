import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ReportesExternoService {

  constructor(private http: HttpClient) { }

  getReporteFicha(alterno: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: any[] }>(`${base_url}/reportes-externos/ficha/${alterno}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }
  getReporteEstado(estado: string, institucion: string, fecha_inicial: Date, fecha_final: Date) {
    return this.http.get<{ ok: boolean, tramites: any[] }>(`${base_url}/reportes-externos/estado/${estado}?fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}&institucion=${institucion}`).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
  getReporteRuta(alterno: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: any[] }>(`${base_url}/reportes-externos/ruta/${alterno}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }
  getReporteSolicitnate(termino: string) {
    return this.http.get<{ ok: boolean, tramites: any }>(`${base_url}/reportes-externos/solicitante/${termino}`).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
  getReporteContribuyente(dni: string) {
    return this.http.get<{ ok: boolean, tramites: any }>(`${base_url}/reportes-externos/contribuyente/${dni}`).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
  getReporteTipoTramite(institucion: string, tipo_tramite: string, fecha_inicial: Date, fecha_final: Date) {
    return this.http.get<{ ok: boolean, tramites: any }>(`${base_url}/reportes-externos/tipo-tramite/${institucion}?tipo_tramite=${tipo_tramite}&fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}`).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
}
