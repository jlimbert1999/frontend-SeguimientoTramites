import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cuenta, CuentaDto } from '../models/cuenta.interface';
import { FuncionarioDto } from '../models/funcionario.interface';
import { myAccount } from 'src/app/home/models/myAccount.interface';
import { institution } from '../interfaces/institution.interface';
import { dependency } from '../interfaces/dependency.interface';
import { account } from '../interfaces/account.interface';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  resultsLength: number = 0

  constructor(private http: HttpClient) { }
  getInstitutions() {
    return this.http.get<institution[]>(`${base_url}/accounts/institutions`).pipe(
      map(resp => resp)
    )
  }
  getDependencies(id_institution: string) {
    return this.http.get<dependency[]>(`${base_url}/accounts/institution-dependencie/${id_institution}`).pipe(
      map(resp => {
        return resp
      })
    )
  }
  getRoles() {
    return this.http.get<{ ok: boolean, roles: { role: string, _id: string }[] }>(`${base_url}/cuentas/roles`).pipe(
      map(resp => {
        return resp.roles
      })
    )
  }
  search(limit: number, offset: number, text: string, id_institution: string | null, id_dependency: string | null) {
    let params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    if (id_institution) {
      params = params.set('institution', id_institution)
      if (id_dependency) {
        params = params.set('dependency', id_dependency)
      }
    }
    if (text !== '') {
      params = params.set('text', text)
    }
    return this.http.get<{ accounts: account[], length: number }>(`${base_url}/accounts/search`, { params }).pipe(
      map(resp => ({ accounts: resp.accounts, length: resp.length }))
    )
  }

  add(cuenta: CuentaDto, funcionario: FuncionarioDto) {
    return this.http.post<account[]>(`${base_url}/cuentas`, { cuenta, funcionario }).pipe(
      map(resp => {
        return resp
      })
    )
  }
  edit(id_cuenta: string, cuenta: { login: string, password?: string, rol: string }) {
    return this.http.put<{ ok: boolean, cuenta: Cuenta }>(`${base_url}/cuentas/${id_cuenta}`, cuenta).pipe(
      map(resp => resp.cuenta)
    )
  }

  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ accounts: account[], length: number }>(`${base_url}/accounts`, { params }).pipe(
      map(resp => {
        console.log(resp.accounts);
        return { accounts: resp.accounts, length: resp.length }
      })
    )
  }
  delete(id_cuenta: string) {
    return this.http.delete<{ ok: boolean, activo: boolean }>(`${base_url}/cuentas/${id_cuenta}`).pipe(
      map(resp => resp.activo)
    )
  }

  getDetails(id_cuenta: string) {
    return this.http.get<{ ok: boolean, details: { externos?: number, internos?: number, entrada?: number, salida?: number } }>(`${base_url}/cuentas/details/${id_cuenta}`).pipe(
      map(resp => {
        return resp.details
      })
    )
  }

  getUsersForAssign(text: string) {
    return this.http.get<{ ok: boolean, funcionarios: any[] }>(`${base_url}/cuentas/funcionarios/${text}`).pipe(
      map(resp => resp.funcionarios)
    )
  }
  unlinkUser(id_cuenta: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/cuentas/unlink/${id_cuenta}`, {}).pipe(
      map(resp => resp.message)
    )
  }
  linkUser(id_cuenta: string, id_newUser: string, id_oldUser?: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/cuentas/link/${id_cuenta}`, { id_newUser, id_oldUser }).pipe(
      map(resp => resp.message)
    )
  }
  addAccountLink(cuenta: CuentaDto, id_funcionario: string) {
    return this.http.post<{ ok: boolean, cuenta: Cuenta }>(`${base_url}/cuentas/link`, { cuenta, id_funcionario }).pipe(
      map(resp => resp.cuenta)
    )
  }
  getMyAccount(id_account: string) {
    return this.http.get<{ ok: boolean, account: myAccount }>(`${base_url}/shared/my-account/${id_account}`).pipe(
      map(resp => resp.account)
    )
  }
  updateMyAccount(id_account: string, login: string, password: string) {
    return this.http.put<{ ok: boolean, login: string }>(`${base_url}/shared/my-account/${id_account}`, { login, password }).pipe(
      map(resp => resp.login)
    )
  }

}
