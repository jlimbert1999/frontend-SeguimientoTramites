import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TiposTramitesModel } from 'src/app/Configuraciones/models/tiposTramites.model';
import { environment } from 'src/environments/environment';
import { Externo, Representante, Solicitante } from '../externos/models/externo';
import { TipoTramite_Registro } from '../externos/models/tipos';
import { ExternoData } from '../externos/models/externo';
import { RepresentanteModel, SolicitanteModel } from '../models/solicitud.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ExternosService {
  offset: number = 0
  limit: number = 10

  constructor(private http: HttpClient) { }
  getTypes(segmento: string) {
    return this.http.get<{ ok: boolean, data: TipoTramite_Registro[] }>(`${base_url}/tramites-externos/tipos/${segmento}`).pipe(
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

  addExterno(tramite: Externo, solicitante: Solicitante, representante: Representante | null) {
    return this.http.post<{ ok: boolean, tramite: ExternoData }>(`${base_url}/tramites-externos`, { tramite, solicitante, representante }).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }
  getExternos() {
    return this.http.get<{ ok: boolean, tramites: ExternoData[], total: number }>(`${base_url}/tramites-externos?offset=${this.offset}&limit=${this.limit}`).pipe(
      map(resp => {
        return { tramites: resp.tramites, total: resp.total }
      })
    )
  }
  editExterno(id_tramite: string, tramite: any, solicitante: Solicitante, representante: Representante | null) {
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
    return this.http.get<{ ok: boolean, data: ExternoData[] }>(`${base_url}/tramites-externos/filtrar/${text}?option=${option}`).pipe(
      map(resp => {
        return resp.data
      })
    )
  }
}
