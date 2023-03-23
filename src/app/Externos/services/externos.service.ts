import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Query, QueryList } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WorkflowData } from 'src/app/Bandejas/models/workflow.interface';
import { TiposTramitesModel } from 'src/app/Configuraciones/models/tiposTramites.model';
import { environment } from 'src/environments/environment';
import { ExternoDto, RepresentanteDto, SolicitanteDto } from '../models/Externo.dto';
import { Externo, TypeTramiteData } from '../models/Externo.interface';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ExternosService {
  resultsLength: number = 0
  offset: number = 0
  limit: number = 10
  textSearch: string = ""



  constructor(private http: HttpClient) { }
  getTypes(segmento: string) {
    return this.http.get<{ ok: boolean, tipos: TypeTramiteData[] }>(`${base_url}/tramites/externos/tipos/${segmento}`).pipe(
      map(resp => {
        return resp.tipos
      })
    )
  }
  getGroups() {
    return this.http.get<{ ok: boolean, groups: string[] }>(`${base_url}/tramites/externos/segmentos`).pipe(
      map(resp => {
        return resp.groups
      })
    )
  }

  Add(tramite: ExternoDto, solicitante: SolicitanteDto, representante: RepresentanteDto | null) {
    return this.http.post<{ ok: boolean, tramite: Externo }>(`${base_url}/tramites/externos`, { tramite, solicitante, representante }).pipe(
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
    return this.http.get<{ ok: boolean, tramites: Externo[], total: number }>(`${base_url}/tramites/externos`, { params }).pipe(
      map(resp => {
        this.resultsLength = resp.total
        return resp.tramites
      })
    )
  }
  Edit(id_tramite: string, tramite: any, solicitante: any, representante: any | null) {
    return this.http.put<{ ok: boolean, tramite: Externo }>(`${base_url}/tramites/externos/${id_tramite}`, { tramite, solicitante, representante }).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }
  GetSearch() {
    let params = new HttpParams()
      .set('limit', this.limit)
      .set('offset', this.offset)
    return this.http.get<{ ok: boolean, tramites: Externo[], total: number }>(`${base_url}/tramites/externos/search/${this.textSearch}`, { params }).pipe(
      map(resp => {
        this.resultsLength = resp.total
        return resp.tramites
      })
    )
  }
  getOne(id_tramite: string) {
    return this.http.get<{ ok: boolean, tramite: Externo, workflow: WorkflowData[] }>(`${base_url}/tramites/externos/${id_tramite}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }

  addObservacion(descripcion: string, id_tramite: string, funcionario: string) {
    return this.http.put<{ ok: boolean, observaciones: any }>(`${base_url}/tramites/externos/observacion/${id_tramite}`, { descripcion, funcionario }).pipe(
      map(resp => {
        return resp.observaciones
      })
    )
  }
  putObservacion(id_tramite: string) {
    return this.http.put<{ ok: boolean, estado: string }>(`${base_url}/tramites/externos/observacion/corregir/${id_tramite}`, {}).pipe(
      map(resp => {
        return resp.estado
      })
    )
  }

  conclude(id_tramite: string, descripcion: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/tramites/externos/concluir/${id_tramite}`, { descripcion }).pipe(
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
