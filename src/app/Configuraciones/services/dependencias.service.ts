import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dependencia } from '../models/dependencia.interface';
import { DependenciaModel } from '../models/dependencia.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class DependenciasService {

  termino_busqueda: string = ""
  busqueda: boolean = false



  constructor(private http: HttpClient) { }
  add(dependencia: Dependencia) {
    return this.http.post<{ ok: boolean, dependencia: Dependencia }>(`${base_url}/dependencias`, dependencia).pipe(
      map(resp => {
        return resp.dependencia
      })
    )
  }
  getInstituciones() {
    return this.http.get<{ ok: boolean, instituciones: { id_institucion: string, nombre: string, sigla: string }[] }>(`${base_url}/dependencias/instituciones`).pipe(
      map(resp => resp.instituciones)
    )
  }
  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, dependencias: Dependencia[], length: number }>(`${base_url}/dependencias`, { params }).pipe(
      map(resp => {
        return { dependencias: resp.dependencias, length: resp.length }
      })
    )
  }
  edit(id_dependencia: string, dependencia: { nombre: string, sigla: string }) {
    return this.http.put<{ ok: boolean, dependencia: DependenciaModel }>(`${base_url}/dependencias/${id_dependencia}`, dependencia).pipe(
      map(resp => resp.dependencia)
    )
  }
  delete(id_dependencia: string) {
    return this.http.delete<{ ok: boolean, dependencia: Dependencia }>(`${base_url}/dependencias/${id_dependencia}`).pipe(
      map(resp => resp.dependencia)
    )
  }
  search(limit: number, offset: number, termino: string) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, dependencias: Dependencia[], length: number }>(`${base_url}/dependencias/search/${termino}`, { params }).pipe(
      map(resp => {
        return { dependencias: resp.dependencias, length: resp.length }
      })
    )
  }
}
