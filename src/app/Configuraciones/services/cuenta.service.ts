import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CuentaDto } from '../models/cuenta.dto';
import { Cuenta } from '../models/cuenta.interface';
import { Funcionario, FuncionarioDto } from '../models/funcionario.interface';
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
  getRoles() {
    return this.http.get<{ ok: boolean, roles: { role: string, _id: string }[] }>(`${base_url}/configuraciones/cuentas/roles`).pipe(
      map(resp => {
        return resp.roles
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

  add(cuenta: CuentaDto, funcionario: FuncionarioDto) {
    return this.http.post<{ ok: boolean, cuenta: Cuenta }>(`${base_url}/configuraciones/cuentas`, { cuenta, funcionario }).pipe(
      map(resp => {
        return resp.cuenta
      })
    )
  }
  edit(id_cuenta: string, login: string, rol: string[], password?: string) {
    return this.http.put<{ ok: boolean, cuenta: Cuenta }>(`${base_url}/configuraciones/cuentas/${id_cuenta}`, { login, rol, password }).pipe(
      map(resp => resp.cuenta)
    )
  }

  Get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, cuentas: Cuenta[], length: number }>(`${base_url}/configuraciones/cuentas`, { params }).pipe(
      map(resp => {
        return { cuentas: resp.cuentas, length: resp.length }
      })
    )
  }

  AddAccountLink(cuenta: Cuenta) {
    return this.http.post<{ ok: boolean, cuenta: Cuenta }>(`${base_url}/cuentas/assign`, cuenta).pipe(
      map(resp => resp.cuenta)
    )
  }

  getUsersForAssign(text: string) {
    return this.http.get<{ ok: boolean, funcionarios: any[] }>(`${base_url}/configuraciones/cuentas/funcionarios/${text}`).pipe(
      map(resp => resp.funcionarios)
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
    return this.http.get<{ ok: boolean, cuentas: Cuenta[], length: number }>(`${base_url}/configuraciones/cuentas/search`, { params }).pipe(
      map(resp => {
        return { cuentas: resp.cuentas, length: resp.length }
      })
    )
  }
  getDetails(id_cuenta: string) {
    return this.http.get<{ ok: boolean, details: { externos?: number, internos?: number, entrada?: number, salida?: number } }>(`${base_url}/configuraciones/cuentas/details/${id_cuenta}`).pipe(
      map(resp => {
        return resp.details
      })
    )
  }
}
