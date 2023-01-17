import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TiposTramitesModel } from 'src/app/Configuraciones/models/tiposTramites.model';
import { environment } from 'src/environments/environment';
import { Externo, Representante, Solicitante } from '../externos/models/externo';
import { TypeTramiteData } from '../externos/models/tipos';
import { ExternoData } from '../externos/models/externo';
import { RepresentanteModel, SolicitanteModel } from '../models/solicitud.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ExternosService {
  resultsLength: number = 0
  offset: number = 0
  limit: number = 10

  constructor(private http: HttpClient) { }
  getTypes(segmento: string) {
    return this.http.get<{ ok: boolean, data: TypeTramiteData[] }>(`${base_url}/tramites-externos/tipos/${segmento}`).pipe(
      map(resp => {
        return resp.data
      })
    )
  }
  getGroups() {
    return this.http.get<{ ok: boolean, data: string[] }>(`${base_url}/tramites-externos/segmentos`).pipe(
      map(resp => {
        return resp.data
      })
    )
  }

  Add(tramite: Externo, solicitante: Solicitante, representante: Representante | null) {
    return this.http.post<{ ok: boolean, tramite: ExternoData }>(`${base_url}/tramites-externos`, { tramite, solicitante, representante }).pipe(
      map(resp => {
        this.resultsLength += 1
        return resp.tramite
      })
    )
  }
  Get() {
    return this.http.get<{ ok: boolean, data: { tramites: ExternoData[], total: number } }>(`${base_url}/tramites-externos`, { params: { limit: this.limit, offset: this.offset } }).pipe(
      map(resp => {
        this.resultsLength = resp.data.total
        return resp.data.tramites
      })
    )
  }
  Edit(id_tramite: string, tramite: any, solicitante: any, representante: any | null) {
    return this.http.put<{ ok: boolean, data: ExternoData }>(`${base_url}/tramites-externos/${id_tramite}`, { tramite, solicitante, representante }).pipe(
      map(resp => {
        return resp.data
      })
    )
  }

  getExterno(id_tramite: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: any[] }>(`${base_url}/tramites-externos/${id_tramite}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }


  generate_HojaRuta(id_tramite: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: any[] }>(`${base_url}/tramites-externos/ruta/${id_tramite}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }

  addObservacion(descripcion: string, id_tramite: string, funcionario: string) {
    return this.http.put<{ ok: boolean, observacion: any }>(`${base_url}/tramites-externos/observacion/${id_tramite}`, { descripcion, funcionario }).pipe(
      map(resp => {
        return resp.observacion
      })
    )
  }
  putObservacion(id_tramite: string) {
    return this.http.put<{ ok: boolean, estado: string }>(`${base_url}/tramites-externos/observacion/corregir/${id_tramite}`, {}).pipe(
      map(resp => {
        return resp.estado
      })
    )
  }

  conclude(id_tramite: string) {
    return this.http.delete<{ ok: boolean, message: string }>(`${base_url}/tramites-externos/${id_tramite}`).pipe(
      map(resp => {
        return resp.message
      })
    )
  }

  filter(text: string, option: string) {
    return this.http.get<{ ok: boolean, data: { tramites: ExternoData[], total: number } }>(`${base_url}/tramites-externos/filter/${text}?option=${option}&limit=${this.limit}&offset=${this.offset}`).pipe(
      map(resp => {
        return { tramites: resp.data.tramites, total: resp.data.total }
      })
    )
  }

  resetPagination() {
    this.offset = 0
    this.limit = 10
  }
  setPagination(limit: number, offset: number) {
    this.limit = limit
    this.offset = offset
  }
}
