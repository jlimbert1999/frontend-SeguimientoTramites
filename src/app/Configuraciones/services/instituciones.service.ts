import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Institucion } from '../models/institucion.model';
import { PaginationService } from './pagination.service';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class InstitucionesService {

  termino_busqueda: string = ""
  busqueda: boolean = false

  constructor(private http: HttpClient, private paginationService: PaginationService) { }

  add(institucion: Institucion) {
    return this.http.post<{ ok: boolean, institucion: Institucion }>(`${base_url}/instituciones`, institucion).pipe(
      map(resp => {
        return resp.institucion
      })
    )
  }
  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, instituciones: Institucion[], length: number }>(`${base_url}/instituciones`, { params }).pipe(
      map(resp => {
        return { instituciones: resp.instituciones, length: resp.length }
      })
    )
  }
  edit(id_institucion: string, institucion: Institucion) {
    return this.http.put<{ ok: boolean, institucion: Institucion }>(`${base_url}/instituciones/${id_institucion}`, institucion).pipe(
      map(resp => resp.institucion)
    )
  }
  delete(id_institucion: string) {
    return this.http.delete<{ ok: boolean, institucion: Institucion }>(`${base_url}/instituciones/${id_institucion}`).pipe(
      map(resp => resp.institucion)
    )
  }

  search(limit: number, offset: number, termino: string) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, instituciones: Institucion[], length: number }>(`${base_url}/instituciones/search/${termino}`, { params }).pipe(
      map(resp => {
        return { instituciones: resp.instituciones, length: resp.length }
      })
    )
  }
  modo_busqueda(activar: boolean) {
    this.busqueda = activar
    this.paginationService.pageIndex = 0
    this.termino_busqueda = ""
  }

}
