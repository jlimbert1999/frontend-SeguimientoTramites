import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Officer } from 'src/app/administration/models/officer.model';
import { InternalProcedureDto, UpdateInternalProcedureDto } from '../dtos';
import { officer, typeProcedure } from 'src/app/administration/interfaces';
import { internal } from '../interfaces';
import { InternalProcedure } from '../models';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class InternalService {
  constructor(private http: HttpClient) {}

  add(form: Object) {
    const procedure = InternalProcedureDto.fromForm(form);
    return this.http
      .post<internal>(`${base_url}/internal`, procedure)
      .pipe(map((response) => InternalProcedure.ResponseToModel(response)));
  }
  edit(id_tramite: string, form: Object) {
    const procedure = UpdateInternalProcedureDto.fromForm(form);
    return this.http
      .put<internal>(`${base_url}/internal/${id_tramite}`, procedure)
      .pipe(map((response) => InternalProcedure.ResponseToModel(response)));
  }

  findAll(limit: number, offset: number) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ ok: boolean; procedures: internal[]; length: number }>(`${base_url}/internal`, { params })
      .pipe(
        map((response) => {
          const model = response.procedures.map((procedure) => InternalProcedure.ResponseToModel(procedure));
          return { procedures: model, length: response.length };
        })
      );
  }
  search(text: string, limit: number, offset: number) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ procedures: internal[]; length: number }>(`${base_url}/internal/search/${text}`, { params })
      .pipe(
        map((response) => {
          const model = response.procedures.map((procedure) => InternalProcedure.ResponseToModel(procedure));
          return { procedures: model, length: response.length };
        })
      );
  }

  findParticipant(text: string) {
    return this.http
      .get<officer[]>(`${base_url}/internal/participant/${text}`)
      .pipe(map((resp) => resp.map((el) => Officer.officerFromJson(el))));
  }

  getTypesProcedures() {
    return this.http.get<typeProcedure[]>(`${base_url}/internal/types-procedures`).pipe(
      map((resp) => {
        return resp;
      })
    );
  }
  conclude(id_tramite: string, descripcion: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(`${base_url}/internos/concluir/${id_tramite}`, { descripcion })
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
  cancel(id_tramite: string, descripcion: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(`${base_url}/internos/cancelar/${id_tramite}`, { descripcion })
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
}
