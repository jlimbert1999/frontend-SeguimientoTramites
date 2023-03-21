import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BandejaSalidaModel_View } from '../models/mail.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class BandejaSalidaService {
  constructor(private http: HttpClient) { }
  offset: number = 0
  limit: number = 10

  Get() {
    const params = new HttpParams()
      .set('offset', this.offset)
      .set('limit', this.limit)
    return this.http.get<{ ok: boolean, mails: any[], length: number }>(
      `${base_url}/bandejas/salida`, { params }).pipe(
        map(resp => {
          return { tramites: resp.mails, total: resp.length }
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
