import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { environment } from 'src/environments/environment';
import { InternoDto } from '../models/interno.dto';
import { Interno } from '../models/Interno.interface';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class InternosService {

  constructor(private http: HttpClient) { }

  Add(tramite: InternoDto) {
    return this.http.post<{ ok: boolean, tramite: Interno }>(`${base_url}/tramites/internos`, tramite).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }
  Edit(id_tramite: string, tramite: any) {
    return this.http.put<{ ok: boolean, tramite: any }>(`${base_url}/tramites/internos/${id_tramite}`, tramite).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }

  Get(limit: number, offset: number) {
    let params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, tramites: Interno[], length: number }>(`${base_url}/tramites/internos`, { params }).pipe(
      map(resp => {
        return { tramites: resp.tramites, length: resp.length }
      })
    )
  }
  GetSearch(limit: number, offset: number, text: string) {
    let params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, tramites: Interno[], length: number }>(`${base_url}/tramites/internos/search/${text}`, { params }).pipe(
      map(resp => {
        return { tramites: resp.tramites, length: resp.length }
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

  getUsers(text: string) {
    return this.http.get<{ ok: boolean, users: any[] }>(`${base_url}/tramites/internos/usuarios/${text}`)
  }
  getTypes() {
    return this.http.get<{ ok: boolean, tipos: any[] }>(`${base_url}/tramites/internos/tipos`).pipe(
      map(resp => {
        return resp.tipos
      })
    )
  }

}
