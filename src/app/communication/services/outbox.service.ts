import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { groupedCommunication } from '../interfaces';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class OutboxService {
  constructor(private http: HttpClient) {}

  getOutboxOfAccount(limit: number, offset: number) {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http
      .get<{ mails: groupedCommunication[]; length: number }>(`${base_url}/communication/outbox`, {
        params,
      })
      .pipe(
        map((resp) => {
          return { mails: resp.mails, length: resp.length };
        })
      );
  }
  search(limit: number, offset: number, text: string) {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http
      .get<{ mails: groupedCommunication[]; length: number }>(`${base_url}/communication/outbox/search/${text}`, {
        params,
      })
      .pipe(
        map((resp) => {
          return { mails: resp.mails, length: resp.length };
        })
      );
  }

  cancelMail(id_procedure: string, ids_mails: string[]) {
    return this.http.delete<{ message: string }>(`${base_url}/communication/outbox/${id_procedure}`, {
      body: { ids_mails },
    });
  }

  cancelOneSend(id_bandeja: string) {
    return this.http.delete<{ ok: boolean; message: string }>(`${base_url}/salidas/${id_bandeja}`).pipe(
      map((resp) => {
        return resp.message;
      })
    );
  }
  cancelAllSend(id_tramite: string, fecha_envio: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(`${base_url}/salidas/all/${id_tramite}`, { fecha_envio })
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
}
