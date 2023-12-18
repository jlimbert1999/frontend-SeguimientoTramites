import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Officer } from 'src/app/administration/models/officer.model';
import { receiver } from '../interfaces/receiver.interface';
import { institution, dependency, account } from 'src/app/administration/interfaces';
import { CreateMailDto } from '../dto/create-mail.dto';
import { communication, statusMail, workflow } from '../interfaces';
import { observation, stateProcedure } from 'src/app/procedures/interfaces';

const base_url = environment.base_url;

interface searchParams {
  text: string;
  status?: statusMail;
}

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  constructor(private http: HttpClient) {}

  getInboxOfAccount(limit: number, offset: number, status?: statusMail) {
    let params = new HttpParams().set('offset', offset * limit).set('limit', limit);
    if (status) params = params.append('status', status);
    return this.http
      .get<{ mails: communication[]; length: number }>(`${base_url}/communication/inbox`, { params })
      .pipe(
        map((resp) => {
          return { mails: resp.mails, length: resp.length };
        })
      );
  }
  searchInboxOfAccount(limit: number, offset: number, { text, status }: searchParams) {
    let params = new HttpParams().set('offset', offset * limit).set('limit', limit);
    if (status) params = params.append('status', status);
    return this.http
      .get<{ mails: communication[]; length: number }>(`${base_url}/communication/inbox/search/${text}`, { params })
      .pipe(
        map((resp) => {
          return { mails: resp.mails, length: resp.length };
        })
      );
  }

  acceptMail(id_mail: string) {
    return this.http.put<{ state: stateProcedure; message: string }>(
      `${base_url}/communication/inbox/accept/${id_mail}`,
      {}
    );
  }
  rejectMail(id_mail: string, rejectionReason: string) {
    return this.http
      .put<{ message: string }>(`${base_url}/communication/inbox/reject/${id_mail}`, { rejectionReason })
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }

  create(data: CreateMailDto) {
    return this.http
      .post<{
        message: string;
      }>(`${base_url}/communication`, data)
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }
  getInstitucions() {
    return this.http.get<institution[]>(`${base_url}/communication/institutions`).pipe(
      map((resp) => {
        return resp;
      })
    );
  }
  getDependenciesOfInstitution(id_institution: string) {
    return this.http.get<dependency[]>(`${base_url}/communication/dependencies/${id_institution}`).pipe(
      map((resp) => {
        return resp;
      })
    );
  }
  getAccountsForSend(id_dependencie: string) {
    return this.http.get<account[]>(`${base_url}/communication/accounts/${id_dependencie}`).pipe(
      map((resp) => {
        const receivers: receiver[] = resp.map((account) => {
          return {
            id_account: account._id,
            officer: Officer.officerFromJson(account.funcionario),
            online: false,
          };
        });
        return receivers;
      })
    );
  }

  Conclude(id_bandeja: string, description: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(`${base_url}/entradas/concluir/${id_bandeja}`, { description })
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }

  getMailDetails(id_mail: string) {
    return this.http.get<communication>(`${base_url}/communication/${id_mail}`);
  }
}
