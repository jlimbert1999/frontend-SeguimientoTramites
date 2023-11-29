import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { external, groupProcedure, procedure } from 'src/app/procedures/interfaces';
import { environment } from 'src/environments/environment';
import { ProcedureTableData, dependentDetails, searchParamsApplicant } from '../interfaces';
import { paginationParams } from 'src/app/shared/interfaces';
import { map } from 'rxjs';
import { account, typeProcedure } from 'src/app/administration/interfaces';
import { communication } from 'src/app/communication/interfaces';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}
  getProceduresByText(text: string) {
    return this.http.get<typeProcedure[]>(`${base_url}/reports/types-procedures/${text}`);
  }

  getOfficersInMyDependency() {
    return this.http.get<account[]>(`${base_url}/reports/dependency/accounts`);
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
          const tableData = resp.procedures.map(({ details: { solicitante }, ...values }) => {
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

  searchProcedureByProperties({ limit, offset }: paginationParams, form: Object) {
    const params = new HttpParams().set('limit', limit).set('offset', offset * limit);
    return this.http.post<{ procedures: procedure[]; length: number }>(`${base_url}/reports/procedure`, form, {
      params,
    });
  }
  getDetailsDependentsByUnit() {
    return this.http.get<dependentDetails[]>(`${base_url}/reports/dependents`);
  }

  searchProcedureByUnit({ limit, offset }: paginationParams, form: Object) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .post<{ communications: communication[]; length: number }>(`${base_url}/reports/unit`, form, { params })
      .pipe(
        map((resp) => {
          const data: ProcedureTableData[] = resp.communications.map(({ procedure, outboundDate, receiver }) => ({
            id_procedure: procedure._id,
            group: procedure.group,
            code: procedure.code,
            reference: procedure.reference,
            state: procedure.state,
            date: outboundDate,
            manager: receiver.fullname,
          }));
          return { data, length: resp.length };
        })
      );
  }

  getValidParamsForm(form: Object) {
    return Object.entries(form).reduce((acc, [key, value]) => (value ? { ...acc, [key]: value } : acc), {});
  }
}
