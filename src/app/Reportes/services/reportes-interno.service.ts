import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ReportesInternoService {

  constructor(private http: HttpClient) { }
  getReporteFicha(alterno: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: any[] }>(`${base_url}/reportes-internos/ficha/${alterno}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }
  getReporteEstado(estado: string, institucion: string, fecha_inicial: Date, fecha_final: Date) {
    return this.http.get<{ ok: boolean, tramites: any[] }>(`${base_url}/reportes-internos/estado/${estado}?fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}&institucion=${institucion}`).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
  getReporteRuta(alterno: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: any[] }>(`${base_url}/reportes-internos/ruta/${alterno}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }
 
  getReporteTipoTramite(institucion: string, tipo_tramite: string, fecha_inicial: Date, fecha_final: Date) {
    return this.http.get<{ ok: boolean, tramites: any }>(`${base_url}/reportes-internos/tipo-tramite/${institucion}?tipo_tramite=${tipo_tramite}&fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}`).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
}
