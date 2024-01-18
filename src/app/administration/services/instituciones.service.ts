import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { institution } from '../interfaces/institution.interface';
import { CreateInstitutionDto } from '../dto/institution.dto';
import { PaginationParameters } from 'src/app/shared/interfaces';
const base_url = environment.base_url;

interface SearchParams extends PaginationParameters {
  term: string;
}
@Injectable({
  providedIn: 'root',
})
export class InstitucionesService {
  constructor(private http: HttpClient) {}

  add(institucion: CreateInstitutionDto) {
    return this.http.post<institution>(`${base_url}/institutions`, institucion).pipe(map((resp) => resp));
  }

  search({ term, ...paginationParams }: SearchParams) {
    const params = new HttpParams({ fromObject: { ...paginationParams } });
    return this.http.get<{ institutions: institution[]; length: number }>(`${base_url}/institutions/search/${term}`, {
      params,
    });
  }

  get(paginationParams: PaginationParameters) {
    const params = new HttpParams({ fromObject: { ...paginationParams } });
    return this.http.get<{ institutions: institution[]; length: number }>(`${base_url}/institutions`, { params });
  }

  edit(id: string, institucion: Partial<institution>) {
    return this.http.put<institution>(`${base_url}/institutions/${id}`, institucion);
  }

  delete(id_institucion: string) {
    return this.http.delete<{ activo: boolean }>(`${base_url}/institutions/${id_institucion}`);
  }
}
