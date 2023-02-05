import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Query, QueryList } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TiposTramitesModel } from 'src/app/Configuraciones/models/tiposTramites.model';
import { environment } from 'src/environments/environment';
import { AllInfoOneExterno, Externo, Representante, Solicitante } from '../externos/models/externo.model';
import { TypeTramiteData } from '../externos/models/tipos';
import { ExternoData } from '../externos/models/externo.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ExternosService {
  resultsLength: number = 0
  offset: number = 0
  limit: number = 10

  searchOptions = {
    active: false,
    type: "",
    text: ""
  }



  constructor(private http: HttpClient) { }
  getTypes(segmento: string) {
    return this.http.get<{ ok: boolean, tipos: TypeTramiteData[] }>(`${base_url}/externos/tipos/${segmento}`).pipe(
      map(resp => {
        return resp.tipos
      })
    )
  }
  getGroups() {
    return this.http.get<{ ok: boolean, groups: string[] }>(`${base_url}/externos/segmentos`).pipe(
      map(resp => {
        return resp.groups
      })
    )
  }

  Add(tramite: Externo, solicitante: Solicitante, representante: Representante | null) {
    return this.http.post<{ ok: boolean, tramite: ExternoData }>(`${base_url}/externos`, { tramite, solicitante, representante }).pipe(
      map(resp => {
        this.resultsLength += 1
        return resp.tramite
      })
    )
  }
  Get() {
    let params = new HttpParams()
      .set('limit', this.limit)
      .set('offset', this.offset)
    return this.http.get<{ ok: boolean, tramites: ExternoData[], total: number }>(`${base_url}/externos`, { params }).pipe(
      map(resp => {
        this.resultsLength = resp.total
        return resp.tramites
      })
    )
  }
  Edit(id_tramite: string, tramite: any, solicitante: any, representante: any | null) {
    return this.http.put<{ ok: boolean, tramite: ExternoData }>(`${base_url}/externos/${id_tramite}`, { tramite, solicitante, representante }).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }
  GetSearch() {
    let params = new HttpParams()
      .set('type', this.searchOptions.type)
      .set('limit', this.limit)
      .set('offset', this.offset)

    return this.http.get<{ ok: boolean, tramites: ExternoData[], total: number }>(`${base_url}/externos/search/${this.searchOptions.text}`, { params }).pipe(
      map(resp => {
        this.resultsLength = resp.total
        return resp.tramites
      })
    )
  }
  getOne(id_tramite: string) {
    return this.http.get<{ ok: boolean, tramite: AllInfoOneExterno, workflow: any[] }>(`${base_url}/externos/${id_tramite}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }

  addObservacion(descripcion: string, id_tramite: string, funcionario: string) {
    return this.http.put<{ ok: boolean, observacion: any }>(`${base_url}/externos/observacion/${id_tramite}`, { descripcion, funcionario }).pipe(
      map(resp => {
        return resp.observacion
      })
    )
  }
  putObservacion(id_tramite: string) {
    return this.http.put<{ ok: boolean, estado: string }>(`${base_url}/externos/observacion/corregir/${id_tramite}`, {}).pipe(
      map(resp => {
        return resp.estado
      })
    )
  }

  conclude(id_tramite: string, referencia: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/externos/concluir/${id_tramite}`, { referencia }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }
  unarchive(id_tramite: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/externos/desarchivar/${id_tramite}`, {}).pipe(
      map(resp => {
        return resp.message
      })
    )
  }

}
