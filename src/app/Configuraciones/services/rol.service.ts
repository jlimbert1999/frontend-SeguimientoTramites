import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Rol, RolDto } from '../models/rol.model';
import { map } from 'rxjs';
import { role } from '../interfaces/role.interface';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) { }
  add(Rol: RolDto) {
    return this.http.post<{ ok: boolean, Rol: Rol }>(`${base_url}/roles`, Rol).pipe(
      map(resp => {
        return resp.Rol
      })
    )
  }
  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ roles: role[], length: number }>(`${base_url}/roles`, { params }).pipe(
      map(resp => {
        return { roles: resp.roles, length: resp.length }
      })
    )
  }
  edit(id: string, Rol: Rol) {
    return this.http.put<{ ok: boolean, Rol: Rol }>(`${base_url}/configuraciones/roles/${id}`, Rol).pipe(
      map(resp => {
        return resp.Rol
      })
    )
  }
}
