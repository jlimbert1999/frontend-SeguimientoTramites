import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { typeProcedure } from 'src/app/administration/interfaces';
import { external } from '../interfaces/external.interface';
import { ExternalProcedureDto } from '../dtos';
import { NestedPartial } from 'src/app/shared/interfaces/nested-partial';
import { searchProcedureParams } from '../interfaces';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ExternalService {
  paginationParams: {
    limit: number;
    offset: number;
    length: number;
  } = {
    length: 0,
    offset: 0,
    limit: 10,
  };

  constructor(private http: HttpClient) {}

  getSegments() {
    return this.http
      .get<{ _id: string }[]>(`${base_url}/external/segments`)
      .pipe(
        map((resp) => {
          return resp.map((element) => element._id);
        })
      );
  }
  getTypesProceduresBySegment(segment: string) {
    return this.http
      .get<typeProcedure[]>(`${base_url}/external/segments/${segment}`)
      .pipe(map((resp) => resp));
  }

  Add(procedure: ExternalProcedureDto) {
    return this.http.post<external>(`${base_url}/external`, procedure).pipe(
      map((resp) => {
        return resp;
      })
    );
  }
  Edit(id_procedure: string, procedure: NestedPartial<ExternalProcedureDto>) {
    return this.http
      .put<external>(`${base_url}/external/${id_procedure}`, procedure)
      .pipe(map((resp) => resp));
  }
  Get(limit: number, offset: number) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ procedures: external[]; length: number }>(`${base_url}/external`, {
        params,
      })
      .pipe(
        map((resp) => {
          this.paginationParams.length = resp.length;
          return { procedures: resp.procedures, length: resp.length };
        })
      );
  }

  search(text: string, limit: number, offset: number) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ procedures: external[]; length: number }>(
        `${base_url}/external/search/${text}`,
        { params }
      )
      .pipe(
        map((resp) => {
          return { procedures: resp.procedures, length: resp.length };
        })
      );
  }

  addObservacion(descripcion: string, id_tramite: string, funcionario: string) {
    return this.http
      .put<{ ok: boolean; observaciones: any }>(
        `${base_url}/externos/observacion/${id_tramite}`,
        { descripcion, funcionario }
      )
      .pipe(
        map((resp) => {
          return resp.observaciones;
        })
      );
  }
  putObservacion(id_tramite: string) {
    return this.http
      .put<{ ok: boolean; estado: string }>(
        `${base_url}/externos/observacion/corregir/${id_tramite}`,
        {}
      )
      .pipe(
        map((resp) => {
          return resp.estado;
        })
      );
  }

  conclude(id_tramite: string, descripcion: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(
        `${base_url}/externos/concluir/${id_tramite}`,
        { descripcion }
      )
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
  cancelProcedure(id_tramite: string, descripcion: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(
        `${base_url}/externos/cancelar/${id_tramite}`,
        { descripcion }
      )
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
  unarchive(id_tramite: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(
        `${base_url}/externos/desarchivar/${id_tramite}`,
        {}
      )
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
}
