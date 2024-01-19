import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AccountDto } from '../dto/account.dto';
import { Officer } from '../models/officer.model';
import { environment } from 'src/environments/environment';
import { institution } from '../interfaces/institution.interface';
import { dependency } from '../interfaces/dependency.interface';
import { account } from '../interfaces/account.interface';
import { officer } from '../interfaces/oficer.interface';
import { role } from '../interfaces/role.interface';
import { job } from '../interfaces/job.interface';
import { Account } from '../models';
import { PaginationParameters } from 'src/app/shared/interfaces';
import { OfficerDto } from '../dto/officer.dto';

interface SearchAccountsParams extends PaginationParameters {
  text: string;
  id_dependency?: string;
}
interface GetAccountsParams extends PaginationParameters {
  id_dependency?: string;
}
@Injectable({
  providedIn: 'root',
})
export class CuentaService {
  private readonly url = `${environment.base_url}/accounts`;

  constructor(private http: HttpClient) {}

  searchJobsForOfficer(text: string) {
    return this.http.get<job[]>(`${this.url}/jobs/${text}`);
  }

  getRoles() {
    return this.http.get<role[]>(`${this.url}/roles`).pipe(map((resp) => resp));
  }
  getInstitutions(text?: string) {
    const params = text ? new HttpParams().set('text', text).set('limit', 5) : undefined;
    return this.http.get<institution[]>(`${this.url}/institutions`, { params });
  }
  getDependenciesOfInstitution(id_institution: string, text?: string) {
    return this.http.get<dependency[]>(`${this.url}/dependencie/${id_institution}`, {
      params: text ? { text } : undefined,
    });
  }
  getOfficersForAssign(text: string) {
    return this.http.get<officer[]>(`${this.url}/officers/assign/${text}`).pipe(
      map((resp) => {
        return resp.map((el) => {
          return Officer.officerFromJson(el);
        });
      })
    );
  }

  addAccountWithAssign(account: any) {
    return this.http.post<account>(`${this.url}/assign`, account).pipe(map((resp) => resp));
  }
  unlinkAccount(id: string) {
    return this.http.delete<{ message: string }>(`${this.url}/unlink/${id}`);
  }
  assignAccountOfficer(id_account: string, id_officer: string) {
    return this.http.put<account>(`${this.url}/assign/${id_account}`, { id_officer }).pipe(map((resp) => resp));
  }

  findAll({ id_dependency, limit, offset }: GetAccountsParams) {
    return this.http
      .get<{ accounts: account[]; length: number }>(`${this.url}`, {
        params: { limit, offset, ...(id_dependency && { id_dependency }) },
      })
      .pipe(
        map((resp) => {
          return { accounts: resp.accounts.map((account) => Account.fromJson(account)), length: resp.length };
        })
      );
  }

  search({ id_dependency, text, ...values }: SearchAccountsParams) {
    const params = new HttpParams({
      fromObject: { ...values, ...(id_dependency && { id_dependency }), ...(text && { text }) },
    });
    return this.http.get<{ accounts: account[]; length: number }>(`${this.url}/search`, { params }).pipe(
      map((resp) => {
        return { accounts: resp.accounts.map((account) => Account.fromJson(account)), length: resp.length };
      })
    );
  }

  add(formAccount: Object, formOfficer: Object) {
    const account = AccountDto.FormtoModel(formAccount);
    const officer = OfficerDto.FormtoModel(formOfficer);
    return this.http.post<account>(`${this.url}`, { officer, account }).pipe(map((resp) => Account.fromJson(resp)));
  }

  edit(id_account: string, account: any) {
    return this.http.put<account>(`${this.url}/${id_account}`, account).pipe(map((resp) => resp));
  }

  delete(id_cuenta: string) {
    return this.http
      .delete<{ ok: boolean; activo: boolean }>(`${this.url}/cuentas/${id_cuenta}`)
      .pipe(map((resp) => resp.activo));
  }

  getDetails(id_cuenta: string) {
    return this.http
      .get<{ ok: boolean; details: { externos?: number; internos?: number; entrada?: number; salida?: number } }>(
        `${this.url}/cuentas/details/${id_cuenta}`
      )
      .pipe(
        map((resp) => {
          return resp.details;
        })
      );
  }

  getMyAccount(id_account: string) {
    return this.http
      .get<{ ok: boolean; account: any }>(`${this.url}/shared/my-account/${id_account}`)
      .pipe(map((resp) => resp.account));
  }
  updateMyAccount(id_account: string, login: string, password: string) {
    return this.http
      .put<{ ok: boolean; login: string }>(`${this.url}/shared/my-account/${id_account}`, { login, password })
      .pipe(map((resp) => resp.login));
  }

  toggleVisibility(id: string) {
    return this.http.put<boolean>(`${this.url}/visibility/${id}`, undefined);
  }
}
