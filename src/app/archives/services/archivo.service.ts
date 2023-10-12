import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Archive } from './models/archive.interface';
import { ArchiveDto } from '../dtos/archive.dto';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ArchivoService {
  constructor(private http: HttpClient) {}

  getAll(limit: number, offset: number) {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get<any>(`${base_url}/archive`, { params }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }
  search(text: string, group: string, limit: number, offset: number) {
    const params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('text', text);
    return this.http
      .get<{ ok: boolean; archives: any[]; length: number }>(
        `${base_url}/archivos/${group}`,
        { params }
      )
      .pipe(
        map((resp) => {
          return { archives: resp.archives, length: resp.length };
        })
      );
  }

  archiveProcedure(id_procedure: string, archive: ArchiveDto) {
    return this.http.post<{ message: string }>(
      `${base_url}/archive/procedure/${id_procedure}`,
      archive
    );
  }

  archiveMail(id_mail: string, archive: ArchiveDto) {
    return this.http.post<{ message: string }>(
      `${base_url}/archive/mail/${id_mail}`,
      archive
    );
  }

  unarchive(id_archive: string, description: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(
        `${base_url}/archivos/${id_archive}`,
        { description }
      )
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
}
