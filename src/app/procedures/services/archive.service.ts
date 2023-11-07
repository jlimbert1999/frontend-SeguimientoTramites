import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EventProcedureDto } from '../dtos/event_procedure.dto';
import { communication } from 'src/app/communication/interfaces';
import { eventProcedure } from '../interfaces';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ArchiveService {
  constructor(private http: HttpClient) {}

  getAll(limit: number, offset: number) {
    const params = new HttpParams().set('offset', offset * limit).set('limit', limit);
    return this.http.get<{ archives: communication[]; length: number }>(`${base_url}/archive`, {
      params,
    });
  }
  search(text: string, limit: number, offset: number) {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http
      .get<{ archives: communication[]; length: number }>(`${base_url}/archive/search/${text}`, { params })
      .pipe(
        map((resp) => {
          return { archives: resp.archives, length: resp.length };
        })
      );
  }
  getEventsProcedure(id_procedure: string) {
    return this.http.get<eventProcedure[]>(`${base_url}/archive/events/${id_procedure}`);
  }
  archiveProcedure(archive: EventProcedureDto) {
    return this.http.post<{ message: string }>(`${base_url}/archive/procedure`, archive);
  }
  archiveMail(id_mail: string, archive: EventProcedureDto) {
    return this.http.post<{ message: string }>(`${base_url}/archive/mail/${id_mail}`, archive);
  }
  unarchiveMail(id_mail: string, eventDto: EventProcedureDto) {
    return this.http.post<{ message: string }>(`${base_url}/archive/mail/restart/${id_mail}`, eventDto);
  }
}
