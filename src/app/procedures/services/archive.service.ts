import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EventProcedureDto } from '../dtos/event_procedure.dto';
import { eventProcedure } from '../interfaces';
import { communicationResponse } from 'src/app/communication/interfaces';
import { PaginationParameters } from 'src/app/shared/interfaces';
import { Communication } from 'src/app/communication/models';

@Injectable({
  providedIn: 'root',
})
export class ArchiveService {
  base_url = environment.base_url;
  constructor(private http: HttpClient) {}

  findAll({ limit, offset }: PaginationParameters): Observable<{ mails: Communication[]; length: number }> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ archives: communicationResponse[]; length: number }>(`${this.base_url}/archive`, {
        params,
      })
      .pipe(
        map((resp) => {
          return {
            mails: resp.archives.map((el) => Communication.ResponseToModel(el)),
            length: resp.length,
          };
        })
      );
  }

  search(text: string, { limit, offset }: PaginationParameters) {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http
      .get<{ archives: communicationResponse[]; length: number }>(`${this.base_url}/archive/search/${text}`, { params })
      .pipe(
        map((resp) => {
          return {
            mails: resp.archives.map((el) => Communication.ResponseToModel(el)),
            length: resp.length,
          };
        })
      );
  }
  getEventsProcedure(id_procedure: string) {
    return this.http.get<eventProcedure[]>(`${this.base_url}/archive/events/${id_procedure}`);
  }
  archiveProcedure(archive: EventProcedureDto) {
    return this.http.post<{ message: string }>(`${this.base_url}/archive/procedure`, archive);
  }
  archiveMail(id_mail: string, archive: EventProcedureDto) {
    return this.http.post<{ message: string }>(`${this.base_url}/archive/mail/${id_mail}`, archive);
  }
  unarchiveMail(id_mail: string, eventDto: EventProcedureDto) {
    return this.http.post<{ message: string }>(`${this.base_url}/archive/mail/restore/${id_mail}`, eventDto);
  }
}
