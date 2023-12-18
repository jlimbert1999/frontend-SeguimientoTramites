import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { typeProcedure } from 'src/app/administration/interfaces';
import { external } from '../interfaces/external.interface';
import { ExternalProcedureDto } from '../dtos';
import { ExternalProcedure } from '../models';

interface CreateExternalForm {
  FormProcedure: Object;
  FormApplicant: Object;
  FormRepresentative: Object;
  Requeriments: string[];
}
interface UpdateExternalForm {
  id_procedure: string;
  FormProcedure: Object;
  FormApplicant: Object;
  FormRepresentative: Object;
}

@Injectable({
  providedIn: 'root',
})
export class ExternalService {
  private readonly base_url = environment.base_url;
  constructor(private http: HttpClient) {}

  getSegments() {
    return this.http.get<{ _id: string }[]>(`${this.base_url}/external/segments`).pipe(
      map((resp) => {
        return resp.map((element) => element._id);
      })
    );
  }
  getTypesProceduresBySegment(segment: string) {
    return this.http.get<typeProcedure[]>(`${this.base_url}/external/segments/${segment}`).pipe(map((resp) => resp));
  }

  add({ FormApplicant, FormProcedure, FormRepresentative, Requeriments }: CreateExternalForm) {
    const procedure = ExternalProcedureDto.fromForm({
      formProcedure: FormProcedure,
      formApplicant: FormApplicant,
      formRepresentative: FormRepresentative,
      requeriments: Requeriments,
    });
    return this.http
      .post<external>(`${this.base_url}/external`, procedure)
      .pipe(map((response) => ExternalProcedure.toModel(response)));
  }
  edit({ FormProcedure, FormRepresentative, FormApplicant, id_procedure }: UpdateExternalForm) {
    const updateProcedure = {
      procedure: FormProcedure,
      details: {
        solicitante: FormApplicant,
        ...(Object.keys(FormRepresentative).length > 0 && { representante: FormRepresentative }),
      },
    };
    console.log(updateProcedure);
    return this.http
      .put<external>(`${this.base_url}/external/${id_procedure}`, updateProcedure)
      .pipe(map((response) => ExternalProcedure.toModel(response)));
  }

  findAll(limit: number, offset: number) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ procedures: external[]; length: number }>(`${this.base_url}/external`, {
        params,
      })
      .pipe(
        map((response) => {
          const model = response.procedures.map((procedure) => ExternalProcedure.toModel(procedure));
          return { procedures: model, length: response.length };
        })
      );
  }

  search(text: string, limit: number, offset: number) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ procedures: external[]; length: number }>(`${this.base_url}/external/search/${text}`, { params })
      .pipe(
        map((response) => {
          const model = response.procedures.map((procedure) => ExternalProcedure.toModel(procedure));
          return { procedures: model, length: response.length };
        })
      );
  }

  addObservacion(descripcion: string, id_tramite: string, funcionario: string) {
    return this.http
      .put<{ ok: boolean; observaciones: any }>(`${this.base_url}/externos/observacion/${id_tramite}`, {
        descripcion,
        funcionario,
      })
      .pipe(
        map((resp) => {
          return resp.observaciones;
        })
      );
  }
  putObservacion(id_tramite: string) {
    return this.http
      .put<{ ok: boolean; estado: string }>(`${this.base_url}/externos/observacion/corregir/${id_tramite}`, {})
      .pipe(
        map((resp) => {
          return resp.estado;
        })
      );
  }

  conclude(id_tramite: string, descripcion: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(`${this.base_url}/externos/concluir/${id_tramite}`, { descripcion })
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
  cancelProcedure(id_tramite: string, descripcion: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(`${this.base_url}/externos/cancelar/${id_tramite}`, { descripcion })
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
  unarchive(id_tramite: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(`${this.base_url}/externos/desarchivar/${id_tramite}`, {})
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
}
