import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { dependency } from '../interfaces/dependency.interface';
import { institution } from '../interfaces/institution.interface';
import { CreateDependencyDto } from '../dto/dependency.dto';
import { PaginationParameters } from 'src/app/shared/interfaces';

interface SearchParams extends PaginationParameters {
  term: string;
}
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class DependenciasService {
  constructor(private http: HttpClient) {}
  getInstitutions() {
    return this.http.get<institution[]>(`${base_url}/dependencies/institutions`).pipe(map((resp) => resp));
  }

  findAll(paginatorParams: PaginationParameters) {
    const params = new HttpParams({ fromObject: { ...paginatorParams } });
    return this.http.get<{ dependencies: dependency[]; length: number }>(`${base_url}/dependencies`, { params });
  }

  search({ term, ...paginatorParams }: SearchParams) {
    const params = new HttpParams({ fromObject: { ...paginatorParams } });
    return this.http.get<{ dependencies: dependency[]; length: number }>(`${base_url}/dependencies/search/${term}`, {
      params,
    });
  }

  add(form: Object) {
    const dependency = CreateDependencyDto.FormToModel(form);
    return this.http.post<dependency>(`${base_url}/dependencies`, dependency);
  }

  edit(id: string, dependency: Partial<CreateDependencyDto>) {
    return this.http.put<dependency>(`${base_url}/dependencies/${id}`, dependency);
  }

  delete(id_dependency: string) {
    return this.http.delete<{ activo: boolean }>(`${base_url}/dependencies/${id_dependency}`).pipe(map((resp) => resp));
  }
}
