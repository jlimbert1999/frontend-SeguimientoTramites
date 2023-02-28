import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsersMails } from '../models/mail.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BandejaEntradaService {
  offset: number = 0;
  limit: number = 10;
  length: number = 0;
  Mails: any[] = [];

  constructor(private http: HttpClient) { }

  Get() {
    const params = new HttpParams()
      .set('offset', this.offset)
      .set('limit', this.limit);
    return this.http
      .get<{ ok: boolean; mails: any[]; length: number }>(
        `${base_url}/bandejas/entrada`,
        { params }
      )
      .pipe(
        map((resp) => {
          this.length = resp.length;
          console.log(resp.mails)
          this.Mails = resp.mails;
        })
      );
  }
  rechazar_tramite(id_bandeja: string, motivo_rechazo: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/bandejas/rechazar/${id_bandeja}`, { motivo_rechazo }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }
  aceptar_tramite(id_bandeja: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/bandejas/aceptar/${id_bandeja}`, {}).pipe(
      map(resp => {
        return resp.message
      })
    )
  }
  Add(data: any) {
    return this.http.post<{ ok: boolean, mails: any[] }>(`${base_url}/bandejas/entrada`, data).pipe(
      map(resp => {
        return resp.mails
      })
    )
  }
  GetAccounts(text: string) {
    return this.http.get<{ ok: boolean, cuentas: UsersMails[] }>(`${base_url}/bandejas/entrada/users/${text}`).pipe(
      map(resp => {
        return resp.cuentas
      })
    )
  }


}
