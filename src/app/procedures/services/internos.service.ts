import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { environment } from 'src/environments/environment';
import { InternoDto } from '../models/interno.dto';
import { Interno } from '../models/Interno.interface';
import { LocationProcedure, WorkflowData } from 'src/app/Bandejas/models/workflow.interface';
import { Observacion } from '../models/Externo.interface';
import { TypesProceduresGrouped } from 'src/app/administration/models/tipoTramite.interface';
import { internal } from '../interfaces/internal.interface';
import { officer } from 'src/app/administration/interfaces/oficer.interface';
import { Officer } from 'src/app/administration/models/officer.model';
import { typeProcedure } from 'src/app/administration/interfaces/typeProcedure.interface';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class InternosService {

  constructor(private http: HttpClient) { }

  Add(tramite: InternoDto) {
    return this.http.post<{ ok: boolean, tramite: Interno }>(`${base_url}/internos`, tramite).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }
  Edit(id_tramite: string, tramite: any) {
    return this.http.put<{ ok: boolean, tramite: Interno }>(`${base_url}/internos/${id_tramite}`, tramite).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }

  Get(limit: number, offset: number) {
    let params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, procedures: internal[], length: number }>(`${base_url}/internal`, { params }).pipe(
      map(resp => {
        return { procedures: resp.procedures, length: resp.length }
      })
    )
  }
  GetSearch(limit: number, offset: number, text: string) {
    let params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, tramites: internal[], length: number }>(`${base_url}/internos/search/${text}`, { params }).pipe(
      map(resp => {
        return { tramites: resp.tramites, length: resp.length }
      })
    )
  }
  getAllDataInternalProcedure(id_procedure: string) {
    return this.http.get<{ ok: boolean, procedure: Interno, workflow: WorkflowData[], location: LocationProcedure[], observations: Observacion[], events: any[] }>(`${base_url}/shared/procedure/tramites_internos/${id_procedure}`).pipe(
      map(resp => {
        resp.workflow.map(element => {
          if (element.receptor.funcionario === undefined) {
            element.receptor.funcionario = {
              nombre: element.receptor.usuario,
              paterno: '',
              materno: '',
              cargo: element.receptor.cargo
            }
          }
          if (element.emisor.funcionario === undefined) {
            element.emisor.funcionario = {
              nombre: element.emisor.usuario,
              paterno: '',
              materno: '',
              cargo: element.emisor.cargo
            }
          }
          return element
        })
        return { procedure: resp.procedure, workflow: resp.workflow, location: resp.location, observations: resp.observations, events: resp.events }
      })
    )
  }

  getParticipant(text: string) {
    return this.http.get<officer[]>(`${base_url}/internal/participant/${text}`).pipe(map(resp => {
      return Officer.officerFromJson(resp)
    }))
  }
  getTypesProcedures() {
    return this.http.get<typeProcedure[]>(`${base_url}/internal/types-procedures`).pipe(
      map(resp => {
        return resp
      })
    )
  }
  conclude(id_tramite: string, descripcion: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/internos/concluir/${id_tramite}`, { descripcion }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }
  cancel(id_tramite: string, descripcion: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/internos/cancelar/${id_tramite}`, { descripcion }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }
}
