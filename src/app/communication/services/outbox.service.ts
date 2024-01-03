import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { GroupedCommunication } from '../models';

import { environment } from 'src/environments/environment';
import { PaginationParameters } from 'src/app/shared/interfaces';
import { groupedCommunicationResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class OutboxService {
  base_url = environment.base_url;
  constructor(private http: HttpClient) {}

  findAll({ limit, offset }: PaginationParameters) {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http
      .get<{ mails: groupedCommunicationResponse[]; length: number }>(`${this.base_url}/communication/outbox`, {
        params,
      })
      .pipe(
        map((resp) => {
          return { mails: resp.mails.map((el) => GroupedCommunication.responseToModel(el)), length: resp.length };
        })
      );
  }

  search({ limit, offset }: PaginationParameters, text: string) {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http
      .get<{ mails: groupedCommunicationResponse[]; length: number }>(
        `${this.base_url}/communication/outbox/search/${text}`,
        { params }
      )
      .pipe(
        map((resp) => {
          return { mails: resp.mails.map((el) => GroupedCommunication.responseToModel(el)), length: resp.length };
        })
      );
  }

  cancelMail(id_procedure: string, ids_mails: string[]) {
    return this.http
      .delete<{ message: string }>(`${this.base_url}/communication/outbox/${id_procedure}`, {
        body: { ids_mails },
      })
      .pipe(map((resp) => resp.message));
  }

  cancelOneSend(id_bandeja: string) {
    return this.http.delete<{ ok: boolean; message: string }>(`${this.base_url}/salidas/${id_bandeja}`).pipe(
      map((resp) => {
        return resp.message;
      })
    );
  }

  cancelAllSend(id_tramite: string, fecha_envio: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(`${this.base_url}/salidas/all/${id_tramite}`, { fecha_envio })
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
}
