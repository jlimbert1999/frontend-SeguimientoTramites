import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationService } from './pagination.service';
import { TipoTramiteDto } from '../models/tipoTramite.dto';
import { Requerimiento } from '../models/requerimiento.dto';
import { TipoTramite } from '../models/tipoTramite.interface';

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

  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, tipos: TipoTramite[], length: number }>(`${base_url}/configuraciones/tipos`, { params }).pipe(
      map(resp => {
        return { tipos: resp.tipos, length: resp.length }
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
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/configuraciones/tipos/requerimientos/${id_tipo}/${id_requisito}`, { nombre }).pipe(map(resp => resp.message))
  }
  cambiar_situacion_requerimiento(id_tipoTramite: string, id_requerimiento: string, activo: boolean) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/tipos-tramites/requerimientos/${id_tipoTramite}/${id_requerimiento}`, { activo }).pipe(map(resp => resp.message))
  }

  modo_busqueda(activar: boolean) {
    this.busqueda = activar
    this.paginationService.pageIndex = 0
    this.termino_busqueda = ""
  }

}
