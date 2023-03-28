import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Entrada } from '../models/entrada.interface';
import { UsersMails } from '../models/mail.model';

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
      `${base_url}/bandejas/entrada`,
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
    return this.http.get<{ ok: boolean, mails: Entrada[], length: number }>(`${base_url}/bandejas/entrada/search/${type}`, { params }).pipe(
      map(resp => {
        this.Mails = resp.mails
        return resp.length
      })
    )
  }


  rechazar_tramite(id_bandeja: string, motivo_rechazo: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/bandejas/rechazar/${id_bandeja}`, { motivo_rechazo }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }
  aceptar_tramite(id_bandeja: string, image: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/bandejas/aceptar/${id_bandeja}`, {image}).pipe(
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

  Conclude(id_bandeja: string, descripcion: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/bandejas/concluir/${id_bandeja}`, { descripcion }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }

  GetDetailsMail(id_bandeja: string) {
    return this.http.get<{ ok: boolean, details: any }>(`${base_url}/bandejas/entrada/detalles/${id_bandeja}`).pipe(
      map(resp => {
        return resp.details
      })
    )
  }


}
