import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoleDto } from '../dto';
import { systemResource, role } from '../interfaces';
import { PaginationParameters } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private readonly base_url = environment.base_url;
  constructor(private http: HttpClient) {}

  get({ limit, offset }: PaginationParameters) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<{ roles: role[]; length: number }>(`${this.base_url}/roles`, { params }).pipe(
      map((resp) => {
        return { roles: resp.roles, length: resp.length };
      })
    );
  }

  getResources() {
    return this.http.get<systemResource[]>(`${this.base_url}/roles/resources`);
  }

  add(name: string, systemResources: systemResource[]): Observable<role> {
    const Role = RoleDto.toModel(name, systemResources);
    return this.http.post<role>(`${this.base_url}/roles`, Role).pipe(map((resp) => resp));
  }

  edit(id: string, name: string, systemResources: systemResource[]): Observable<role> {
    const Role = RoleDto.toModel(name, systemResources);
    return this.http.put<role>(`${this.base_url}/roles/${id}`, Role).pipe(map((resp) => resp));
  }
}
