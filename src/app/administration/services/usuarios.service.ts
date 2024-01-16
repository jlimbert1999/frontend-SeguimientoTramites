import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { CreateOfficerDto } from '../dto/officer.dto';
import { officer } from '../interfaces/oficer.interface';
import { workHistory } from '../interfaces/workHistory.interface';
import { Officer } from '../models/officer.model';
import { PaginationParameters } from 'src/app/shared/interfaces';
import { job } from '../interfaces';
import { OfficerDto } from '../dto/officer.dto';

interface SearchParmeters extends PaginationParameters {
  text: string;
}
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient) {}
  searchJobs(term: string) {
    return this.http.get<job[]>(`${base_url}/officer/jobs/${term}`);
  }
  agregar_multiples_funcionarios(funcionarios: any[]) {
    return this.http.post<{ ok: boolean; funcionarios: any }>(`${base_url}/usuarios/cargar`, { funcionarios }).pipe(
      map((resp) => {
        return resp.funcionarios;
      })
    );
  }

  search({ limit, offset, text }: SearchParmeters) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ officers: officer[]; length: number }>(`${base_url}/officer/search/${text}`, { params })
      .pipe(
        map((resp) => {
          return { officers: resp.officers.map((officer) => Officer.officerFromJson(officer)), length: resp.length };
        })
      );
  }

  findAll({ limit, offset }: PaginationParameters) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<{ ok: boolean; officers: officer[]; length: number }>(`${base_url}/officer`, { params }).pipe(
      map((resp) => {
        return { officers: resp.officers.map((officer) => Officer.officerFromJson(officer)), length: resp.length };
      })
    );
  }
  add(officer: Object): Observable<Officer> {
    const officerDto = OfficerDto.FormtoModel(officer);
    return this.http
      .post<officer>(`${base_url}/officer`, officerDto)
      .pipe(map((resp) => Officer.officerFromJson(resp)));
  }

  edit(id_officer: string, officer: officer) {
    return this.http.put<officer>(`${base_url}/officer/${id_officer}`, officer).pipe(map((resp) => resp));
  }

  delete(id_officer: string) {
    return this.http.delete<officer>(`${base_url}/officer/${id_officer}`).pipe(map((resp) => resp));
  }

  removeJob(id_officer: string) {
    return this.http.put<{ message: string }>(`${base_url}/officer/unlink/${id_officer}`, undefined);
  }
  getWorkHistory(id_officer: string, limit: number, offset: number) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<workHistory[]>(`${base_url}/officer/history/${id_officer}`, { params })
      .pipe(map((resp) => resp));
  }
}
