import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TiposTramitesModel } from 'src/app/Configuraciones/models/tiposTramites.model';
import { environment } from 'src/environments/environment';
import { RepresentanteModel, SolicitanteModel } from '../models/solicitud.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class TramiteService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  // obtener_segmentos() {
  //   return this.http.get<{ ok: boolean, segmentos: string[] }>(`${base_url}/tramites/externo/segmentos`).pipe(
  //     map(resp => {
  //       return resp.segmentos
  //     })
  //   )
  // }
  // agregar_tramite_externo(tramite: ExternoModel, solicitante: SolicitanteModel, representante: RepresentanteModel) {
  //   return this.http.post<{ ok: boolean, tramite: any }>(`${base_url}/tramites/externo`, { tramite, solicitante, representante }).pipe(
  //     map(resp => {
  //       return resp.tramite
  //     })
  //   )
  // }
  editar_tramite_externo(id_tramite: string, tramite: any, solicitante: SolicitanteModel, representante: RepresentanteModel | null) {
    return this.http.put<{ ok: boolean, tramite: any }>(`${base_url}/tramites/externo/${id_tramite}`, { tramite, solicitante, representante }).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }
  // obtener_tramites_externos(pageIndex: number, items: number): Observable<{ ok: boolean, tramites: ExternoData[] }> {
  //   return this.http.get<{ ok: boolean, tramites: ExternoData[] }>(`${base_url}/tramites`).pipe(
  //     map(resp => {
  //       return resp
  //     })
  //   )
  // }
  obtener_tramite_externo(id_tramite: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: any[], participantes: any[], instituciones: any[] }>(`${base_url}/tramites-externos/${id_tramite}`).pipe(
      map(resp => {
        console.log(resp)
        return { tramite: resp.tramite, workflow: resp.workflow, participantes: resp.participantes, instituciones: resp.instituciones }
      })
    )
  }

  obtener_control_tramites() {
    return this.http.get<{ ok: boolean, tramites: any }>(`${base_url}/tramites/control/registrados`).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }

  obtener_tipos_tramites(tipo: 'INTERNO' | 'EXTERNO') {
    return this.http.get<{ ok: boolean, tiposTramites: TiposTramitesModel[], segmentos: string[] }>(`${base_url}/tramites/tipos?tipo=${tipo}`).pipe(
      map(resp => {
        return { tiposTramites: resp.tiposTramites, segmentos: resp.segmentos }
      })
    )
  }

  filtrar_tramites(tipo_filtro: string, termino: string) {
    return this.http.get<{ ok: boolean, tramites: any }>(`${base_url}/tramites/filtrar/${termino}?tipo=${tipo_filtro}`).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }

  generar_hoja_ruta(id_tramite: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: any[] }>(`${base_url}/tramites/hoja-ruta/${id_tramite}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )

  }
}
