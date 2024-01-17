import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { officer, workHistoryResponse, job } from '../interfaces';
import { Officer } from '../models/officer.model';
import { PaginationParameters } from 'src/app/shared/interfaces';
import { OfficerDto } from '../dto/officer.dto';

interface SearchParmeters extends PaginationParameters {
  text: string;
}
@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly base_url = environment.base_url;

  constructor(private http: HttpClient) {}
  searchJobs(term: string) {
    return this.http.get<job[]>(`${this.base_url}/officer/jobs/${term}`);
  }
  agregar_multiples_funcionarios(funcionarios: any[]) {
    return this.http
      .post<{ ok: boolean; funcionarios: any }>(`${this.base_url}/usuarios/cargar`, { funcionarios })
      .pipe(
        map((resp) => {
          return resp.funcionarios;
        })
      );
  }

  search({ limit, offset, text }: SearchParmeters) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ officers: officer[]; length: number }>(`${this.base_url}/officer/search/${text}`, { params })
      .pipe(
        map((resp) => {
          return { officers: resp.officers.map((officer) => Officer.officerFromJson(officer)), length: resp.length };
        })
      );
  }

  findAll({ limit, offset }: PaginationParameters) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ ok: boolean; officers: officer[]; length: number }>(`${this.base_url}/officer`, { params })
      .pipe(
        map((resp) => {
          return { officers: resp.officers.map((officer) => Officer.officerFromJson(officer)), length: resp.length };
        })
      );
  }
  add(officer: Object): Observable<Officer> {
    const officerDto = OfficerDto.FormtoModel(officer);
    return this.http
      .post<officer>(`${this.base_url}/officer`, officerDto)
      .pipe(map((resp) => Officer.officerFromJson(resp)));
  }

  edit(id_officer: string, officer: Partial<Officer>): Observable<Officer> {
    return this.http
      .put<officer>(`${this.base_url}/officer/${id_officer}`, officer)
      .pipe(map((resp) => Officer.officerFromJson(resp)));
  }

  delete(id_officer: string) {
    return this.http.delete<{ activo: boolean }>(`${this.base_url}/officer/${id_officer}`);
  }

  removeJob(id_officer: string) {
    return this.http.put<{ message: string }>(`${this.base_url}/officer/unlink/${id_officer}`, undefined);
  }
  getWorkHistory(id_officer: string, offset: number) {
    const params = new HttpParams().set('offset', offset);
    return this.http
      .get<workHistoryResponse[]>(`${this.base_url}/officer/history/${id_officer}`, { params })
      .pipe(map((resp) => resp));
  }
}
