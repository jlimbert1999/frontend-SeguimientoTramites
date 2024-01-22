import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Officer } from 'src/app/administration/models/officer.model';
import { receiver } from '../interfaces/receiver.interface';
import { institution, dependency, account } from 'src/app/administration/interfaces';
import { CreateMailDto } from '../dto/create-mail.dto';
import { TransferDetails, communicationResponse, statusMail } from '../interfaces';
import { observation, stateProcedure } from 'src/app/procedures/interfaces';
import { Communication } from '../models';
import { PaginationParameters } from 'src/app/shared/interfaces';

interface SearchParams extends PaginationParameters {
  text: string;
  status?: statusMail;
}

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  base_url = environment.base_url;
  constructor(private http: HttpClient) {}

  findAll(
    { limit, offset }: PaginationParameters,
    status?: statusMail
  ): Observable<{ mails: Communication[]; length: number }> {
    let params = new HttpParams().set('offset', offset).set('limit', limit);
    if (status) params = params.append('status', status);
    return this.http
      .get<{ mails: communicationResponse[]; length: number }>(`${this.base_url}/communication/inbox`, { params })
      .pipe(
        map((resp) => {
          return { mails: resp.mails.map((el) => Communication.ResponseToModel(el)), length: resp.length };
        })
      );
  }

  search({ status, text, ...values }: SearchParams): Observable<{ mails: Communication[]; length: number }> {
    const params = new HttpParams({ fromObject: { ...values, ...(status && { status }) } });
    return this.http
      .get<{ mails: communicationResponse[]; length: number }>(`${this.base_url}/communication/inbox/search/${text}`, {
        params,
      })
      .pipe(
        map((resp) => {
          return { mails: resp.mails.map((el) => Communication.ResponseToModel(el)), length: resp.length };
        })
      );
  }

  acceptMail(id_mail: string) {
    return this.http.put<{ state: stateProcedure; message: string }>(
      `${this.base_url}/communication/accept/${id_mail}`,
      {}
    );
  }

  rejectMail(id_mail: string, rejectionReason: string) {
    return this.http.put<{ message: string }>(`${this.base_url}/communication/reject/${id_mail}`, { rejectionReason });
  }

  create(details: TransferDetails, FormSend: Object, receivers: receiver[]) {
    const mail = CreateMailDto.fromFormData(FormSend, receivers, details);
    return this.http
      .post<{
        message: string;
      }>(`${this.base_url}/communication`, mail)
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }
  getInstitucions() {
    return this.http.get<institution[]>(`${this.base_url}/communication/institutions`).pipe(
      map((resp) => {
        return resp;
      })
    );
  }
  getDependenciesOfInstitution(id_institution: string) {
    return this.http.get<dependency[]>(`${this.base_url}/communication/dependencies/${id_institution}`).pipe(
      map((resp) => {
        return resp;
      })
    );
  }
  getAccountsForSend(id_dependencie: string) {
    return this.http.get<account[]>(`${this.base_url}/communication/accounts/${id_dependencie}`).pipe(
      map((resp) => {
        const receivers: receiver[] = resp.map((account) => {
          return {
            id_account: account._id,
            officer: Officer.officerFromJson(account.funcionario!),
            online: false,
          };
        });
        return receivers;
      })
    );
  }

  Conclude(id_bandeja: string, description: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(`${this.base_url}/entradas/concluir/${id_bandeja}`, { description })
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }

  getMailDetails(id: string) {
    return this.http
      .get<communicationResponse>(`${this.base_url}/communication/${id}`)
      .pipe(map((resp) => Communication.ResponseToModel(resp)));
  }
}
