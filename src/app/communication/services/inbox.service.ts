import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocationProcedure, WorkflowData } from '../models/workflow.interface';
import { inbox } from '../interfaces/inbox.interface';
import { Officer } from 'src/app/administration/models/officer.model';
import { receiver } from '../interfaces/receiver.interface';
import { institution, dependency, account } from 'src/app/administration/interfaces';
import { CreateMailDto } from '../dto/create-mail.dto';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  constructor(private http: HttpClient) { }

  Get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit);
    return this.http.get<{ mails: inbox[]; length: number }>(`${base_url}/inbox`, { params }).pipe(
      map((resp) => {
        return { mails: resp.mails, length: resp.length }
      }
      ));
  }
  Search(limit: number, offset: number, type: 'INTERNO' | 'EXTERNO', text: string) {
    let params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('text', text)
    return this.http.get<{ ok: boolean, mails: any[], length: number }>(`${base_url}/entradas/search/${type}`, { params }).pipe(
      map(resp => {

        return resp.length
      })
    )
  }


  aceptMail(id_bandeja: string) {
    return this.http.put<{ ok: boolean, state: string, message: string }>(`${base_url}/entradas/acept/${id_bandeja}`, {}).pipe(
      map(resp => {
        return { message: resp.message, state: resp.state }
      })
    )
  }
  rejectMail(id_bandeja: string, motivo_rechazo: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/entradas/rechazar/${id_bandeja}`, { motivo_rechazo }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }
  Add(data: CreateMailDto) {
    return this.http.post<inbox[]>(`${base_url}/inbox`, data).pipe(
      map(resp => {
        return resp
      })
    )
  }
  // GetAccounts(text: string) {
  //   return this.http.get<{ ok: boolean, cuentas: AccountForSend[] }>(`${base_url}/entradas/users/${text}`).pipe(
  //     map(resp => {
  //       return resp.cuentas
  //     })
  //   )
  // }
  getInstitucions() {
    return this.http.get<institution[]>(`${base_url}/inbox/institutions`).pipe(
      map(resp => {
        return resp
      })
    )
  }
  getDependenciesOfInstitution(id_institution: string) {
    return this.http.get<dependency[]>(`${base_url}/inbox/dependencies/${id_institution}`).pipe(
      map(resp => {
        return resp
      })
    )
  }
  getAccountsOfDependencie(id_dependencie: string) {
    return this.http.get<account[]>(`${base_url}/inbox/accounts/${id_dependencie}`).pipe(
      map(resp => {
        const receivers: receiver[] = resp.map(account => {
          return {
            id_account: account._id,
            officer: Officer.officerFromJson(account.funcionario),
            online: false
          }
        })
        return receivers
      })
    )
  }

  Conclude(id_bandeja: string, description: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/entradas/concluir/${id_bandeja}`, { description }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }

  getDetailsMail(id_bandeja: string) {
    return this.http.get<{ ok: boolean, mail: any, procedure: any, observations: any[], workflow: WorkflowData[], location: LocationProcedure[], events: any[] }>(`${base_url}/entradas/${id_bandeja}`).pipe(
      map(resp => {
        resp.workflow = resp.workflow.map(mail => {
          mail.emisor.funcionario ? mail.emisor.funcionario : { nombre: 'Desvinculado', paterno: '', materno: '', cargo: '----' }
          return mail
        })
        return {
          mail: resp.mail,
          tramite: resp.procedure,
          workflow: resp.workflow,
          observations: resp.observations,
          location: resp.location,
          events: resp.events
        }
      })
    )
  }
  addObservation(id_procedure: string, description: string) {
    return this.http.put<{ ok: boolean, observation: any }>(`${base_url}/entradas/observar/${id_procedure}`, { description }).pipe(
      map(resp => {
        return resp.observation
      })
    )
  }
  repairObservation(id_observation: string) {
    return this.http.put<{ ok: boolean, state: string }>(`${base_url}/entradas/corregir/${id_observation}`, {}).pipe(
      map(resp => {
        return resp.state
      })
    )
  }
}
