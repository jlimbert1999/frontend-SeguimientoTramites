import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InstitucionModel } from '../models/institucion.model';
import { PaginationService } from './pagination.service';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class InstitucionesService {

  termino_busqueda: string = ""
  busqueda: boolean = false

  constructor(private http: HttpClient, private paginationService: PaginationService) { }

  agregar_institucion(institucion: InstitucionModel) {
    return this.http.post<{ ok: boolean, institucion: InstitucionModel }>(`${base_url}/instituciones`, institucion).pipe(
      map(resp => {
        this.paginationService.dataSize += 1
        return resp.institucion
      })
    )
  }
  obtener_instituciones() {
    return this.http.get<{ ok: boolean, instituciones: InstitucionModel[], total: number }>(`${base_url}/instituciones?pageIndex=${this.paginationService.pageIndex}&rows=${this.paginationService.rows}`).pipe(
      map(resp => {
        this.paginationService.dataSize = resp.total
        this.paginationService.pageIndex = 0
        return resp.instituciones
      })
    )
  }
  actualizar_institucion(id_institucion: string, institucion: InstitucionModel) {
    return this.http.put<{ ok: boolean, institucion: InstitucionModel }>(`${base_url}/instituciones/${id_institucion}`, institucion).pipe(
      map(resp => resp.institucion)
    )
  }
  cambiar_situacion_institucion(id_institucion: string, activo: boolean) {
    let newSituacion: boolean
    if (activo === false) {
      newSituacion = true
    }
    else {
      newSituacion = false
    }
    return this.http.put<{ ok: boolean, institucion: InstitucionModel }>(`${base_url}/instituciones/${id_institucion}`, { activo: newSituacion }).pipe(
      map(resp => resp.institucion)
    )
  }

  buscar_instituciones(termino: string) {
    return this.http.get<{ ok: boolean, instituciones: InstitucionModel[], total: number }>(`${base_url}/instituciones/${termino}`).pipe(
      map(resp => {
        this.paginationService.dataSize = resp.total
        return resp.instituciones
      })
    )
  }
  modo_busqueda(activar: boolean) {
    this.busqueda = activar
    this.paginationService.pageIndex = 0
    this.termino_busqueda = ""
  }

}
