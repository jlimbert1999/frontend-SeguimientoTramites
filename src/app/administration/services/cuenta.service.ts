import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { CreateAccountDto } from '../dto/account.dto';
import { CreateOfficerDto } from '../dto/officer.dto';
import { Officer } from '../models/officer.model';
import { environment } from 'src/environments/environment';
import { institution } from '../interfaces/institution.interface';
import { dependency } from '../interfaces/dependency.interface';
import { account } from '../interfaces/account.interface';
import { officer } from '../interfaces/oficer.interface';
import { role } from '../interfaces/role.interface';
import { job } from '../interfaces/job.interface';


const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  constructor(private http: HttpClient) { }
  getJobForOfficer(text: string) {
    return this.http.get<job[]>(`${base_url}/accounts/jobs/${text}`).pipe(
      map(resp => resp)
    )
  }
  getRoles() {
    return this.http.get<role[]>(`${base_url}/accounts/roles`).pipe(
      map(resp => resp)
    )
  }
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
  getOfficersForAssign(text: string) {
    return this.http.get<officer[]>(`${base_url}/accounts/officers/assign/${text}`).pipe(
      map(resp => {
        return resp.map(el => {
          return Officer.officerFromJson(el)
        })
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
      map(resp => {
        resp.accounts.map(account => {
          if (account.funcionario) {
            Object.keys(account.funcionario).length === 0 ? delete account.funcionario : null
          }
          return account
        })
        return { accounts: resp.accounts, length: resp.length }
      })
    )
  }
  addAccountWithAssign(account: CreateAccountDto) {
    return this.http.post<account>(`${base_url}/accounts/assign`, account).pipe(
      map(resp => resp)
    )
  }
  unlinkAccountOfficer(id_account: string) {
    return this.http.delete<account>(`${base_url}/accounts/unlink/${id_account}`).pipe(
      map(resp => resp)
    )
  }
  assignAccountOfficer(id_account: string, id_officer: string) {
    return this.http.put<account>(`${base_url}/accounts/assign/${id_account}`, { id_officer }).pipe(
      map(resp => resp)
    )
  }


  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ accounts: account[], length: number }>(`${base_url}/accounts`, { params }).pipe(
      map(resp => {
        return { accounts: resp.accounts, length: resp.length }
      })
    )
  }

  add(officer: CreateOfficerDto, account: CreateAccountDto) {
    return this.http.post<account>(`${base_url}/accounts`, { officer, account })
  }

  edit(id_account: string, account: any) {
    return this.http.put<account>(`${base_url}/accounts/${id_account}`, account).pipe(
      map(resp => resp)
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

  getMyAccount(id_account: string) {
    return this.http.get<{ ok: boolean, account: any }>(`${base_url}/shared/my-account/${id_account}`).pipe(
      map(resp => resp.account)
    )
  }
  updateMyAccount(id_account: string, login: string, password: string) {
    return this.http.put<{ ok: boolean, login: string }>(`${base_url}/shared/my-account/${id_account}`, { login, password }).pipe(
      map(resp => resp.login)
    )
  }

}
