import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DependenciaModel } from '../models/dependencia.model';
import { PaginationService } from './pagination.service';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class DependenciasService {

  termino_busqueda: string = ""
  busqueda: boolean = false



  constructor(private http: HttpClient, private paginationService: PaginationService) { }
  agregar_dependencia(dependencia: DependenciaModel) {
    return this.http.post<{ ok: boolean, dependencia: DependenciaModel }>(`${base_url}/dependencias`, dependencia).pipe(
      map(resp => {
        this.paginationService.dataSize += 1
        return resp.dependencia
      })
    )
  }
  obtener_instituciones_habilitadas() {
    return this.http.get<{ ok: boolean, instituciones: { id_institucion: string, nombre: string, sigla: string }[] }>(`${base_url}/dependencias/instituciones/registro`).pipe(
      map(resp => resp.instituciones)
    )
  }
  obtener_dependencias() {
    return this.http.get<{ ok: boolean, dependencias: DependenciaModel[], total: number }>(`${base_url}/dependencias?pageIndex=${this.paginationService.pageIndex}&rows=${this.paginationService.rows}`).pipe(
      map(resp => {
        this.paginationService.dataSize = resp.total
        return resp.dependencias
      })
    )
  }
  actualizar_dependencia(id_dependencia: string, dependencia: { nombre: string, sigla: string }) {
    return this.http.put<{ ok: boolean, dependencia: DependenciaModel }>(`${base_url}/dependencias/${id_dependencia}`, dependencia).pipe(
      map(resp => resp.dependencia)
    )
  }
  cambiar_situacion_dependencia(id_dependencia: string, activo: boolean) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/dependencias/situacion/${id_dependencia}`, { activo }).pipe(
      map(resp => resp.message)
    )
  }

  buscar_dependencia(termino: string) {
    return this.http.get<{ ok: boolean, dependencias: DependenciaModel[], total: number }>(`${base_url}/dependencias/${termino}?pageIndex=${this.paginationService.pageIndex}&rows=${this.paginationService.rows}`).pipe(
      map(resp => {
        this.paginationService.dataSize = resp.total
        return resp.dependencias
      })
    )
  }
  modo_busqueda(activar: boolean) {
    this.busqueda = activar
    this.paginationService.pageIndex = 0
    this.termino_busqueda = ""
  }
}
