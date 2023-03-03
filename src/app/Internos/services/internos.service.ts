import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Interno } from '../models/Interno.interface';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class InternosService {
  resultsLength: number = 0
  offset: number = 0
  limit: number = 10

  constructor(private http: HttpClient) { }

  Get() {
    let params = new HttpParams()
      .set('limit', this.limit)
      .set('offset', this.offset)
    return this.http.get<{ ok: boolean, tramites: Interno[], length: number }>(`${base_url}/tramites/internos`, { params }).pipe(
      map(resp => {
        this.resultsLength = resp.length
        return resp.tramites
      })
    )
  }
  GetOne(id_tramite: string) {
    return this.http.get<{ ok: boolean, tramite: any, workflow: any[] }>(`${base_url}/tramites/internos/${id_tramite}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }

}
