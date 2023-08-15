import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { internal } from '../interfaces/internal.interface';
import { officer } from 'src/app/administration/interfaces/oficer.interface';
import { Officer } from 'src/app/administration/models/officer.model';
import { typeProcedure } from 'src/app/administration/interfaces/typeProcedure.interface';
import { CreateInternalProcedureDto } from '../dtos/create-internal.dto';
import { UpdateInternalProcedureDto } from '../dtos/update-internal.dto';
import { InternalDetail } from '../models/interno.model';
import { newWorkflow } from 'src/app/communication/interfaces/workflow.interface';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class InternosService {

  constructor(private http: HttpClient) { }

  markProcedureAsSend(id_procedure: string) {
    return this.http.patch<{ ok: boolean }>(`${base_url}/internal/send/${id_procedure}`, undefined)
  }

  Add(tramite: CreateInternalProcedureDto) {
    return this.http.post<internal>(`${base_url}/internal`, tramite).pipe(
      map(resp => {
        return resp
      })
    )
  }
  Edit(id_tramite: string, tramite: UpdateInternalProcedureDto) {
    return this.http.put<internal>(`${base_url}/internal/${id_tramite}`, tramite).pipe(
      map(resp => {
        return resp
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
  search(limit: number, offset: number, text: string) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ procedures: internal[], length: number }>(`${base_url}/internal/search/${text}`, { params }).pipe(
      map(resp => {
        return { procedures: resp.procedures, length: resp.length }
      })
    )
  }
  getAllDataInternalProcedure(id_procedure: string) {
    return this.http.get<{ procedure: any, workflow: newWorkflow[], observations: any[], events: any[] }>(`${base_url}/internal/${id_procedure}`).pipe(
      map(resp => {
        return { procedure: InternalDetail.frmJson(resp.procedure), workflow: resp.workflow }
        // resp.workflow.map(element => {
        //   if (element.receptor.funcionario === undefined) {
        //     element.receptor.funcionario = {
        //       nombre: element.receptor.usuario,
        //       paterno: '',
        //       materno: '',
        //       cargo: element.receptor.cargo
        //     }
        //   }
        //   if (element.emisor.funcionario === undefined) {
        //     element.emisor.funcionario = {
        //       nombre: element.emisor.usuario,
        //       paterno: '',
        //       materno: '',
        //       cargo: element.emisor.cargo
        //     }
        //   }
        //   return element
        // })
      })
    )
  }

  getParticipant(text: string) {
    return this.http.get<officer[]>(`${base_url}/internal/participant/${text}`).pipe(
      map(resp => resp.map(el => Officer.officerFromJson(el))))
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
