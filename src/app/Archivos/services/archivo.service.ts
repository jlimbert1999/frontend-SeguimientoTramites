import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  constructor(private http: HttpClient) { }

  Get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit);
    return this.http.get<{ ok: boolean, archives: any[], length: number }>(`${base_url}/archivos`, { params })
      .pipe(
        map((resp) => {
          return { archives: resp.archives, length: resp.length }
        })
      );
  }

  unarchive(id_archive: string, description: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/archivos/${id_archive}`, { description })
      .pipe(map((resp) => {
        return resp.message
      })
      );
  }

}
