import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Rol, RolDto } from '../models/rol.model';
import { map } from 'rxjs';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) { }
  add(Rol: RolDto) {
    return this.http.post<{ ok: boolean, Rol: Rol }>(`${base_url}/configuraciones/roles`, Rol).pipe(
      map(resp => {
        return resp.Rol
      })
    )
  }
  get() {
    return this.http.get<{ ok: boolean, Roles: Rol[] }>(`${base_url}/configuraciones/roles`).pipe(
      map(resp => {
        return resp.Roles
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
