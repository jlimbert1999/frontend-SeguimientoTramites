import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Entrada } from '../models/entrada.interface';
import { UsersMails } from '../models/mail.model';
import { Externo } from 'src/app/Tramites/models/Externo.interface';
import { Interno } from 'src/app/Tramites/models/Interno.interface';

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

  declineProcedure(id_bandeja: string, motivo_rechazo: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/entradas/rechazar/${id_bandeja}`, { motivo_rechazo }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }
  aceptProcedure(id_bandeja: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/entradas/aceptar/${id_bandeja}`, {}).pipe(
      map(resp => {
        return resp.message
      })
    )
  }
  Add(data: any) {
    return this.http.post<{ ok: boolean, mails: any[] }>(`${base_url}/entradas`, data).pipe(
      map(resp => {
        return resp.mails
      })
    )
  }
  GetAccounts(text: string) {
    return this.http.get<{ ok: boolean, cuentas: UsersMails[] }>(`${base_url}/entradas/users/${text}`).pipe(
      map(resp => {
        return resp.cuentas
      })
    )
  }

  Conclude(id_bandeja: string, descripcion: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/entradas/concluir/${id_bandeja}`, { descripcion }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }

  getDetailsMail(id_bandeja: string) {
    return this.http.get<{ ok: boolean, imbox: any, allDataProcedure: { tramite: any, workflow: any[], location: any[] } }>(`${base_url}/entradas/${id_bandeja}`).pipe(
      map(resp => {
        return {
          imbox: resp.imbox,
          tramite: resp.allDataProcedure.tramite,
          workflow: resp.allDataProcedure.workflow,
          location: resp.allDataProcedure.location
        }
      })
    )
  }


}
