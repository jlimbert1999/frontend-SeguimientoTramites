import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { LocationProcedure, WorkflowData } from 'src/app/Bandejas/models/workflow.interface';
import { environment } from 'src/environments/environment';
import { ExternoDto, RepresentanteDto, SolicitanteDto } from '../models/Externo.dto';
import { Externo, Observacion } from '../models/Externo.interface';
import { TipoTramite } from 'src/app/Configuraciones/models/tipoTramite.interface';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ExternosService {

  constructor(private http: HttpClient) { }

  getTypesProcedures() {
    return this.http.get<{ ok: boolean, types: TipoTramite[] }>(`${base_url}/externos/tipos`).pipe(
      map(resp => {
        let segments: string[] = []
        resp.types.forEach(type => {
          if (!segments.includes(type.segmento)) {
            segments.push(type.segmento)
          }
        });
        return { segments, types: resp.types }
      })
    )
  }

  Add(tramite: ExternoDto, solicitante: SolicitanteDto, representante: RepresentanteDto | null) {
    return this.http.post<{ ok: boolean, tramite: Externo }>(`${base_url}/externos`, { tramite, solicitante, representante }).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }
  Get(limit: number, offset: number) {
    let params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, tramites: Externo[], total: number }>(`${base_url}/externos`, { params }).pipe(
      map(resp => {

        return { tramites: resp.tramites, length: resp.total }
      })
    )
  }
  Edit(id_tramite: string, tramite: any, solicitante: any, representante: any | null) {
    return this.http.put<{ ok: boolean, tramite: Externo }>(`${base_url}/externos/${id_tramite}`, { tramite, solicitante, representante }).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }
  GetSearch(limit: number, offset: number, text: string) {
    let params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, tramites: Externo[], length: number }>(`${base_url}/externos/buscar/${text}`, { params }).pipe(
      map(resp => {
        return { tramites: resp.tramites, length: resp.length }
      })
    )
  }
  getAllDataExternalProcedure(id_procedure: string) {
    return this.http.get<{ ok: boolean, procedure: Externo, workflow: WorkflowData[], location: LocationProcedure[], observations: Observacion[], events: any[] }>(`${base_url}/shared/procedure/tramites_externos/${id_procedure}`).pipe(
      map(resp => {
        return { procedure: resp.procedure, workflow: resp.workflow, location: resp.location, observations: resp.observations, events: resp.events }
      })
    )
  }

  addObservacion(descripcion: string, id_tramite: string, funcionario: string) {
    return this.http.put<{ ok: boolean, observaciones: any }>(`${base_url}/externos/observacion/${id_tramite}`, { descripcion, funcionario }).pipe(
      map(resp => {
        return resp.observaciones
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

  conclude(id_tramite: string, descripcion: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/externos/concluir/${id_tramite}`, { descripcion }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }
  cancelProcedure(id_tramite: string, descripcion: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/externos/cancelar/${id_tramite}`, { descripcion }).pipe(
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
