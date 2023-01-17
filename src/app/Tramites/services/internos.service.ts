import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { TiposTramitesModel } from 'src/app/Configuraciones/models/tiposTramites.model';
import { environment } from 'src/environments/environment';
import { TipoTramiteInternoModel, TramiteInternoModel } from '../models/interno.model';
const base_url = environment.base_url


@Injectable({
  providedIn: 'root'
})
export class InternosService {
  resultsLength: number = 0
  offset: number = 0
  limit: number = 10

  constructor(private http: HttpClient) { }

  addInterno(tramite: TramiteInternoModel) {
    return this.http.post<{ ok: boolean, data: any }>(`${base_url}/tramites-internos`, tramite).pipe(
      map(resp => {
        this.resultsLength += 1
        return resp.data
      })
    )
  }
  getInternos() {
    return this.http.get<{ ok: boolean, data: { tramites: any[], total: number } }>(`${base_url}/tramites-internos`).pipe(
      map(resp => {
        this.resultsLength = resp.data.total
        return resp.data.tramites
      })
    )
  }
  editInterno(id_tramite: string, tramite: any) {
    return this.http.put<{ ok: boolean, tramite: any }>(`${base_url}/tramites-internos/${id_tramite}`, tramite).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }
  getInterno(id_tramite: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: any[] }>(`${base_url}/tramites-internos/${id_tramite}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }

  conclude(id_tramite: string) {
    return this.http.delete<{ ok: boolean, message: string }>(`${base_url}/tramites-internos/${id_tramite}`).pipe(
      map(resp => {
        return resp.message
      })
    )
  }

  addObservacion(descripcion: string, id_tramite: string, funcionario: string) {
    return this.http.put<{ ok: boolean, observacion: any }>(`${base_url}/tramites-internos/observacion/${id_tramite}`, { descripcion, funcionario }).pipe(
      map(resp => {
        return resp.observacion
      })
    )
  }
  putObservacion(id_tramite: string) {
    return this.http.put<{ ok: boolean, estado: string }>(`${base_url}/tramites-internos/observacion/corregir/${id_tramite}`, {}).pipe(
      map(resp => {
        return resp.estado
      })
    )
  }

  getUsuarios(nombre: string) {
    return this.http.get<{ ok: boolean, usuarios: any[] }>(`${base_url}/tramites-internos/usuarios/${nombre}`)
  }
  getTiposTramite() {
    return this.http.get<{ ok: boolean, tipos_tramites: TipoTramiteInternoModel[] }>(`${base_url}/tramites-internos/tipos`).pipe(
      map(resp => {
        return resp.tipos_tramites
      })
    )
  }
}
