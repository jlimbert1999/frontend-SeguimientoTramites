import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AllInfoOneInterno, InternoData } from '../internos/models/interno.model';
const base_url = environment.base_url


@Injectable({
  providedIn: 'root'
})
export class InternosService {
  resultsLength: number = 0
  offset: number = 0
  limit: number = 10

  searchOptions = {
    active: false,
    type: "",
    text: ""
  }

  constructor(private http: HttpClient) { }

  Add(tramite: InternoData) {
    return this.http.post<{ ok: boolean, tramite: InternoData }>(`${base_url}/internos`, tramite).pipe(
      map(resp => {
        this.resultsLength += 1
        return resp.tramite
      })
    )
  }
  Get() {
    let params = new HttpParams()
      .set('limit', this.limit)
      .set('offset', this.offset)
    return this.http.get<{ ok: boolean, tramites: InternoData[], total: number }>(`${base_url}/internos`, { params }).pipe(
      map(resp => {
        this.resultsLength = resp.total
        return resp.tramites
      })
    )
  }
  editInterno(id_tramite: string, tramite: any) {
    return this.http.put<{ ok: boolean, tramite: any }>(`${base_url}/internos/${id_tramite}`, tramite).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }
  GetOne(id_tramite: string) {
    return this.http.get<{ ok: boolean, tramite: AllInfoOneInterno, workflow: any[] }>(`${base_url}/internos/${id_tramite}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }

  conclude(id_tramite: string, referencia: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/internos/concluir/${id_tramite}`, { referencia }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }

  addObservacion(descripcion: string, id_tramite: string, funcionario: string) {
    return this.http.put<{ ok: boolean, observacion: any }>(`${base_url}/internos/observacion/${id_tramite}`, { descripcion, funcionario }).pipe(
      map(resp => {
        return resp.observacion
      })
    )
  }
  putObservacion(id_tramite: string) {
    return this.http.put<{ ok: boolean, estado: string }>(`${base_url}/internos/observacion/corregir/${id_tramite}`, {}).pipe(
      map(resp => {
        return resp.estado
      })
    )
  }

  getUsers(nombre: string) {
    return this.http.get<{ ok: boolean, usuarios: any[] }>(`${base_url}/internos/usuarios/${nombre}`)
  }
  getTypes() {
    return this.http.get<{ ok: boolean, tipos: any[] }>(`${base_url}/internos/tipos`).pipe(
      map(resp => {
        return resp.tipos
      })
    )
  }

  GetSearch() {
    let params = new HttpParams()
      .set('type', this.searchOptions.type)
      .set('limit', this.limit)
      .set('offset', this.offset)
    return this.http.get<{ ok: boolean, tramites: InternoData[], total: number }>(`${base_url}/internos/search/${this.searchOptions.text}`, { params }).pipe(
      map(resp => {
        this.resultsLength = resp.total
        return resp.tramites
      })
    )
  }
}
