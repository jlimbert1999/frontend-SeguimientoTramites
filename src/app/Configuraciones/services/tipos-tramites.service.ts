import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Requerimiento, TipoTramite } from '../models/tipoTramite.interface';
import { typeProcedure } from '../interfaces/typeProcedure.interface';
import { CreateTypeProcedureDto, UpdateTypeProcedureDto } from '../dto/typeProcedure.dto';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TiposTramitesService {
  constructor(private http: HttpClient) { }

  getSegments() {
    return this.http.get<{ _id: string }[]>(`${base_url}/type-procedure/segments`,).pipe(
      map(resp => {
        return resp.map(element => element._id)
      })
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
  add(typeProcedure: CreateTypeProcedureDto) {
    return this.http.post<typeProcedure>(`${base_url}/type-procedure`, typeProcedure).pipe(
      map(resp => resp)
    )
  }
  edit(id_typeProcedure: string, typeProcedure: UpdateTypeProcedureDto) {
    return this.http.put<typeProcedure>(`${base_url}/type-procedure/${id_typeProcedure}`, typeProcedure).pipe(
      map(resp => resp)
    )
  }
  delete(id_tipoTramite: string) {
    return this.http.delete<{ ok: boolean, tipo: TipoTramite }>(`${base_url}/configuraciones/tipos/${id_tipoTramite}`).pipe(
      map(resp => resp.tipo)
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

}
