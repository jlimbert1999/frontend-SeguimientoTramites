import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CuentaModel, CuentaData } from '../models/cuenta.model';
import { Funcionario } from '../models/funcionario.interface';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  resultsLength: number = 0

  constructor(private http: HttpClient) { }
  getInstituciones() {
    return this.http.get<{ ok: boolean, instituciones: { id_institucion: string, nombre: string, sigla: string }[] }>(`${base_url}/configuraciones/dependencias/instituciones`).pipe(
      map(resp => resp.instituciones)
    )
  }

  getDependencias(id_institucion: string) {
    return this.http.get<{ ok: boolean, dependencias: { id_dependencia: string, nombre: string }[] }>(`${base_url}/configuraciones/cuentas/dependencias/${id_institucion}`).pipe(
      map(resp => {
        return resp.dependencias
      })
    )
  }
  obtener_funcionarios_asignacion() {
    return this.http.get<{ ok: boolean, funcionarios: { _id: string, nombre: string, cargo: string, dni: string }[] }>(`${base_url}/cuentas/usuarios`).pipe(
      map(resp => {
        return resp.funcionarios
      })
    )
  }

  agregar_cuenta(cuenta: CuentaModel, funcionario: Funcionario) {
    return this.http.post<{ ok: boolean, cuenta: CuentaData }>(`${base_url}/cuentas`, { cuenta, funcionario }).pipe(
      map(resp => {
        return resp.cuenta
      })
    )
  }
  Edit(id_cuenta: string, cuenta: CuentaModel) {
    return this.http.put<{ ok: boolean, cuenta: CuentaModel }>(`${base_url}/cuentas/${id_cuenta}`, cuenta).pipe(
      map(resp => resp.cuenta)
    )
  }

  Get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, cuentas: CuentaData[], length: number }>(`${base_url}/configuraciones/cuentas`, { params }).pipe(
      map(resp => {
        return { cuentas: resp.cuentas, length: resp.length }
      })
    )
  }

  AddAccountLink(cuenta: CuentaModel) {
    return this.http.post<{ ok: boolean, cuenta: CuentaData }>(`${base_url}/cuentas/assign`, cuenta).pipe(
      map(resp => resp.cuenta)
    )
  }

  getUsersForAssign(text: string) {
    return this.http.get<{ ok: boolean, users: any[] }>(`${base_url}/cuentas/assign/${text}`).pipe(
      map(resp => resp.users)
    )
  }

  unlinkUser(id_cuenta: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/cuentas/unlink/${id_cuenta}`, {}).pipe(
      map(resp => resp.message)
    )
  }
  assignUser(id_cuenta: string, id_newUser: string, id_oldUser?: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/cuentas/assign/${id_cuenta}`, { id_newUser, id_oldUser }).pipe(
      map(resp => resp.message)
    )
  }
  delete(id_cuenta: string) {
    return this.http.delete<{ ok: boolean, activo: boolean }>(`${base_url}/cuentas/${id_cuenta}`).pipe(
      map(resp => resp.activo)
    )
  }
  search(limit: number, offset: number, text: string, id_institucion: string | null, id_dependencia: string | null) {
    let params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    if (id_institucion) {
      params = params.set('institucion', id_institucion)
      if (id_dependencia) {
        params = params.set('dependencia', id_dependencia)
      }
    }
    if (text !== '') {
      params = params.set('text', text)
    }
    return this.http.get<{ ok: boolean, cuentas: CuentaData[], length: number }>(`${base_url}/configuraciones/cuentas/search`, { params }).pipe(
      map(resp => {
        return { cuentas: resp.cuentas, length: resp.length }
      })
    )
  }
}
