import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TiposTramitesModel } from '../models/tiposTramites.model';
import { RequerimientoModel } from '../models/requerimientos';
import { PaginationService } from './pagination.service';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TiposTramitesService {

  termino_busqueda: string = ""
  busqueda: boolean = false
  constructor(private http: HttpClient, private paginationService: PaginationService) { }
  agregar_tipoTramite(tipoTramite: TiposTramitesModel, requerimientos: RequerimientoModel[]) {
    return this.http.post<{ ok: boolean, tipoTramite: TiposTramitesModel }>(`${base_url}/tipos-tramites`, { ...tipoTramite, requerimientos }).pipe(
      map(resp => {
        this.paginationService.dataSize = this.paginationService.dataSize + 1
        return resp.tipoTramite
      })
    )
  }

  obtener_tiposTramites() {
    return this.http.get<{ ok: boolean, tiposTramites: TiposTramitesModel[], total: number }>(`${base_url}/tipos-tramites?pageIndex=${this.paginationService.pageIndex}&rows=${this.paginationService.rows}`).pipe(
      map(resp => {
        this.paginationService.dataSize = resp.total
        return resp.tiposTramites
      })
    )
  }
  editar_tiposTramites(id_tipoTramite: string, tipoTramite: TiposTramitesModel) {
    return this.http.put<{ ok: boolean, tipoTramite: TiposTramitesModel }>(`${base_url}/tipos-tramites/${id_tipoTramite}`, tipoTramite).pipe(
      map(resp => resp.tipoTramite)
    )
  }
  cambiar_situacion_tipoTramite(id_tipoTramite: string, activo: boolean) {
    return this.http.put<{ ok: boolean, tipoTramite: TiposTramitesModel }>(`${base_url}/tipos-tramites/${id_tipoTramite}`, { activo }).pipe(
      map(resp => resp.tipoTramite)
    )
  }
  buscar_tipoTramite() {
    return this.http.get<{ ok: boolean, tiposTramites: TiposTramitesModel[], total: number }>(`${base_url}/tipos-tramites/${this.termino_busqueda}`).pipe(
      map(resp => {
        this.paginationService.dataSize = resp.total
        return resp.tiposTramites
      })
    )
  }

  editar_requirimiento(id_tipoTramite: string, id_requerimiento: string, nombre: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/tipos-tramites/requerimientos/${id_tipoTramite}/${id_requerimiento}`, { nombre }).pipe(map(resp => resp.message))
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
