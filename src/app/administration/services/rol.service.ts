import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { systemModule, role } from '../interfaces/role.interface';
import { RoleDto } from '../dto';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class RolService {
  constructor(private http: HttpClient) {}
  get(limit: number, offset: number) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ roles: role[]; length: number }>(`${base_url}/roles`, { params })
      .pipe(
        map((resp) => {
          return { roles: resp.roles, length: resp.length };
        })
      );
  }
  getResources() {
    return this.http.get<systemModule[]>(`${base_url}/roles/resources`).pipe(
      map((resp) => {
        return resp;
      })
    );
  }
  add(role: RoleDto) {
    return this.http
      .post<role>(`${base_url}/roles`, role)
      .pipe(map((resp) => resp));
  }

  edit(id: string, role: RoleDto) {
    return this.http
      .put<role>(`${base_url}/roles/${id}`, role)
      .pipe(map((resp) => resp));
  }
}
