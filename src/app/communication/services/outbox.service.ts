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

  cancelMails(id_procedure: string, ids_mails: string[]) {
    return this.http.delete<{ message: string }>(`${this.base_url}/communication/outbox/${id_procedure}`, {
      body: { ids_mails },
    });
  }
}
