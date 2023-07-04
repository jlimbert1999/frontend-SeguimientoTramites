import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationService } from './pagination.service';
import { TipoTramiteDto } from '../models/tipoTramite.dto';
import { Requerimiento, TipoTramite } from '../models/tipoTramite.interface';
import { typeProcedure } from '../interfaces/typeProcedure.interface';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TiposTramitesService {

  termino_busqueda: string = ""
  busqueda: boolean = false
  constructor(private http: HttpClient, private paginationService: PaginationService) { }
  agregar_tipoTramite(tipoTramite: TipoTramiteDto, requerimientos: Requerimiento[]) {
    return this.http.post<{ ok: boolean, tipoTramite: TipoTramiteDto }>(`${base_url}/tipos-tramites`, { ...tipoTramite, requerimientos }).pipe(
      map(resp => {
        this.paginationService.dataSize = this.paginationService.dataSize + 1
        return resp.tipoTramite
      })
    )
  }

  getSegments() {
    return this.http.get<{ _id: string }[]>(`${base_url}/type-procedure/segments`,).pipe(
      map(resp => {
        return resp.map(element => element._id)
      })
    )
  }
  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ typesProcedures: typeProcedure[], length: number }>(`${base_url}/type-procedure`, { params }).pipe(
      map(resp => {
        return { tipos: resp.typesProcedures, length: resp.length }
      })
    )
  }
  edit(id_tipoTramite: string, tipoTramite: TipoTramite) {
    return this.http.put<{ ok: boolean, tipo: TipoTramite }>(`${base_url}/configuraciones/tipos/${id_tipoTramite}`, tipoTramite).pipe(
      map(resp => resp.tipo)
    )
  }
  delete(id_tipoTramite: string) {
    return this.http.delete<{ ok: boolean, tipo: TipoTramite }>(`${base_url}/configuraciones/tipos/${id_tipoTramite}`).pipe(
      map(resp => resp.tipo)
    )
  }
  search(limit: number, offset: number, text: string) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, tipos: TipoTramite[], length: number }>(`${base_url}/configuraciones/tipos/search/${text}`, { params }).pipe(
      map(resp => {
        return { tipos: resp.tipos, length: resp.length }
      })
    )
  }

  editRequirement(id_tipo: string, id_requisito: string, nombre: string) {
    return this.http.put<{ ok: boolean, requisito: Requerimiento }>(`${base_url}/configuraciones/tipos/requerimientos/${id_tipo}/${id_requisito}`, { nombre })
      .pipe(map(resp => resp.requisito))
  }
  deleteRequirement(id_tipoTramite: string, id_requerimiento: string) {
    return this.http.delete<{ ok: boolean, requisito: Requerimiento }>(`${base_url}/configuraciones/tipos/requerimientos/${id_tipoTramite}/${id_requerimiento}`)
      .pipe(map(resp => resp.requisito))
  }

  modo_busqueda(activar: boolean) {
    this.busqueda = activar
    this.paginationService.pageIndex = 0
    this.termino_busqueda = ""
  }

}
