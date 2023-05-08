import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountForSend, Entrada, Mail } from '../models/entrada.interface';
import { Observacion } from 'src/app/Tramites/models/Externo.interface';
import { LocationProcedure, WorkflowData } from '../models/workflow.interface';
import { EntradaDto } from '../models/entrada.dto';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BandejaEntradaService {
  Mails: Entrada[] = [];
  constructor(private http: HttpClient) { }

  Get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit);
    return this.http.get<{ ok: boolean; mails: Entrada[]; length: number }>(
      `${base_url}/entradas`,
      { params }
    ).pipe(map((resp) => {
      this.Mails = resp.mails;
      return resp.length
    })
    );
  }
  Search(limit: number, offset: number, type: 'INTERNO' | 'EXTERNO', text: string) {
    let params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('text', text)
    return this.http.get<{ ok: boolean, mails: Entrada[], length: number }>(`${base_url}/entradas/search/${type}`, { params }).pipe(
      map(resp => {
        this.Mails = resp.mails
        return resp.length
      })
    )
  }


  aceptMail(id_bandeja: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/entradas/aceptar/${id_bandeja}`, {}).pipe(
      map(resp => {
        return resp.message
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
  Add(data: EntradaDto) {
    return this.http.post<{ ok: boolean, mails: Entrada }>(`${base_url}/entradas`, data).pipe(
      map(resp => {
        return resp.mails
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
    return this.http.get<{ ok: boolean, institutions: any[] }>(`${base_url}/entradas/instituciones`).pipe(
      map(resp => {
        return resp.institutions
      })
    )
  }
  getDependenciesOfInstitution(id_institution: string) {
    return this.http.get<{ ok: boolean, dependencies: any[] }>(`${base_url}/entradas/dependencias/${id_institution}`).pipe(
      map(resp => {
        return resp.dependencies
      })
    )
  }
  getAccountsOfDependencie(id_dependencie: string) {
    return this.http.get<{ ok: boolean, accounts: AccountForSend[] }>(`${base_url}/entradas/cuentas/${id_dependencie}`).pipe(
      map(resp => {
        resp.accounts.map(account => account.funcionario.fullname = `${account.funcionario.nombre} ${account.funcionario.paterno} ${account.funcionario.materno}`)
        return resp.accounts
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
    return this.http.get<{ ok: boolean, mail: Mail, procedure: any, observations: Observacion[], workflow: WorkflowData[], location: LocationProcedure[] }>(`${base_url}/entradas/${id_bandeja}`).pipe(
      map(resp => {
        return {
          mail: resp.mail,
          tramite: resp.procedure,
          workflow: resp.workflow,
          observations: resp.observations,
          location: resp.location
        }
      })
    )
  }
  addObservation(id_procedure: string, description: string) {
    return this.http.put<{ ok: boolean, observation: Observacion }>(`${base_url}/entradas/observar/${id_procedure}`, { description }).pipe(
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
