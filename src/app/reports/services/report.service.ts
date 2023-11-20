import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { external, groupProcedure, procedure } from 'src/app/procedures/interfaces';
import { environment } from 'src/environments/environment';
import { procedureTableData, searchParamsApplicant } from '../interfaces';
import { paginationParams } from 'src/app/shared/interfaces';
import { map } from 'rxjs';
import { typeProcedure } from 'src/app/administration/interfaces';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {

  }

  getProcedureSegments(type: 'INTERNO' | 'EXTERNO') {
    return this.http
      .get<{ _id: string }[]>(`${base_url}/reports/procedure/segments/${type}`)
      .pipe(map((resp) => resp.map((el) => el._id)));
  }
  getProceduresBySegment(segment: string) {
    return this.http.get<typeProcedure[]>(`${base_url}/reports/procedure/segment/${segment}`);
  }

  searchProcedureByCode(code: string) {
    const params = new HttpParams().set('code', code);
    return this.http.get<{ _id: string; group: groupProcedure }>(`${base_url}/reports/procedure/code`, { params });
  }
  searchProcedureByApplicant(
    { limit, offset }: paginationParams,
    applicant: searchParamsApplicant,
    typeSearch: 'solicitante' | 'representante'
  ) {
    const params = new HttpParams().set('limit', limit).set('offset', offset * limit);
    return this.http
      .post<{ procedures: external[]; length: number }>(`${base_url}/reports/procedure/${typeSearch}`, applicant, {
        params,
      })
      .pipe(
        map((resp) => {
          const tableData: procedureTableData[] = resp.procedures.map(({ details: { solicitante }, ...values }) => {
            const fullname =
              solicitante.tipo === 'NATURAL'
                ? [solicitante.nombre, solicitante.paterno, solicitante.materno].filter(Boolean).join(' ')
                : `${solicitante.nombre}`;
            return {
              _id: values._id,
              code: values.code,
              reference: values.reference,
              state: values.state,
              startDate: values.startDate,
              applicant: fullname,
              group: values.group,
            };
          });
          return { procedures: tableData, length: resp.length };
        })
      );
  }

  searchProcedureByProperties({ limit, offset }: paginationParams, form: any) {
    const params = new HttpParams().set('limit', limit).set('offset', offset * limit);
    return this.http.post<{ procedures: procedure[]; length: number }>(
      `${base_url}/reports/procedure`,
      this.getValidParamsForm(form),
      {
        params,
      }
    );
  }

  getValidParamsForm(form: Object) {
    return Object.entries(form).reduce((acc, [key, value]) => (value ? { ...acc, [key]: value } : acc), {});
  }
}
