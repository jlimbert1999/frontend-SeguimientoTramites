import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BandejaSalidaModel_View } from '../models/mail.model';
import { Salida } from '../models/salida.interface';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class BandejaSalidaService {
  constructor(private http: HttpClient) { }

  Get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
    return this.http.get<{ ok: boolean, mails: Salida[], length: number }>(
      `${base_url}/bandejas/salida`, { params }).pipe(
        map(resp => {
          console.log(resp);
          return { mails: resp.mails, length: resp.length }
        })
      )
  }
  Search(limit: number, offset: number, type: 'INTERNO' | 'EXTERNO', text: string) {
    let params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('text', text)
    return this.http.get<{ ok: boolean, mails: Salida[], length: number }>(`${base_url}/bandejas/salida/search/${type}`, { params }).pipe(
      map(resp => {
        return { mails: resp.mails, length: resp.length }
      })
    )
  }

  cancel(id_bandeja: string) {
    return this.http.delete<{ ok: boolean, message: string }>(
      `${base_url}/bandejas/salida/${id_bandeja}`).pipe(
        map(resp => {
          return resp.message
        })
      )
  }
}
