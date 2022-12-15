import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TiposTramitesModel } from 'src/app/Configuraciones/models/tiposTramites.model';
import { environment } from 'src/environments/environment';
import { ExternoData, ExternoModel } from '../models/externo.model';
import { RepresentanteModel, SolicitanteModel } from '../models/solicitud.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ExternosService {
  offset: number = 0
  limit: number = 10
  constructor(private http: HttpClient) { }
  getTiposTramite() {
    return this.http.get<{ ok: boolean, tiposTramites: TiposTramitesModel[], segmentos: string[] }>(`${base_url}/tramites-externos/tipos?tipo=EXTERNO`).pipe(
      map(resp => {
        return { tiposTramites: resp.tiposTramites, segmentos: resp.segmentos }
      })
    )
  }

  addExterno(tramite: ExternoModel, solicitante: SolicitanteModel, representante: RepresentanteModel) {
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
  editExterno(id_tramite: string, tramite: any, solicitante: SolicitanteModel, representante: RepresentanteModel | null) {
    return this.http.put<{ ok: boolean, tramite: ExternoData }>(`${base_url}/tramites-externos/${id_tramite}`, { tramite, solicitante, representante }).pipe(
      map(resp => {
        return resp.tramite
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

  addObservacion(descripcion: string, id_tramite: string, funcionario: string, estado: string) {
    return this.http.put<{ ok: boolean, observacion: any, estado: string }>(`${base_url}/tramites-externos/observacion/${id_tramite}`, { descripcion, funcionario, estado }).pipe(
      map(resp => {
        return { estado: resp.estado, observacion: resp.observacion }
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



}
