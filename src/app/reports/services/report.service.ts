import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { external, groupProcedure, procedure } from 'src/app/procedures/interfaces';
import { account, institution, typeProcedure } from 'src/app/administration/interfaces';
import { PaginationParameters } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';
import { ProcedureTableData, ReportTotalProcedures, dependentDetails, totalReportParams } from '../interfaces';
import { communicationResponse } from 'src/app/communication/interfaces';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}
  public getValidFormParameters(form: Object) {
    return Object.entries(form).reduce((acc, [key, value]) => (value ? { ...acc, [key]: value } : acc), {});
  }

  getProceduresByText(text: string) {
    return this.http.get<typeProcedure[]>(`${base_url}/reports/types-procedures/${text}`);
  }

  getOfficersInMyDependency() {
    return this.http.get<account[]>(`${base_url}/reports/dependency/accounts`);
  }

  getInstitutions() {
    return this.http.get<institution[]>(`${base_url}/reports/institutions`);
  }

  searchProcedureByCode(code: string) {
    const params = new HttpParams().set('code', code);
    return this.http.get<{ _id: string; group: groupProcedure }>(`${base_url}/reports/procedure/code`, { params });
  }
  searchProcedureByApplicant(
    { limit, offset }: PaginationParameters,
    applicant: Object,
    typeSearch: 'solicitante' | 'representante'
  ) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .post<{ procedures: external[]; length: number }>(`${base_url}/reports/procedure/${typeSearch}`, applicant, {
        params,
      })
      .pipe(
        map((resp) => {
          const data: ProcedureTableData[] = resp.procedures.map(({ details: { solicitante }, ...values }) => {
            return {
              id_procedure: values._id,
              group: values.group,
              code: values.code,
              reference: values.reference,
              state: values.state,
              date: values.startDate,
              applicant: [solicitante.nombre, solicitante.paterno, solicitante.materno].filter(Boolean).join(' '),
            };
          });
          return { procedures: data, length: resp.length };
        })
      );
  }

  searchProcedureByProperties({ limit, offset }: PaginationParameters, form: Object) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .post<{ procedures: procedure[]; length: number }>(
        `${base_url}/reports/procedure`,
        this.getValidFormParameters(form),
        { params }
      )
      .pipe(
        map((resp) => {
          const data = resp.procedures.map(({ _id, code, reference, startDate, state, group }) => ({
            id_procedure: _id,
            date: startDate,
            reference,
            state,
            group,
            code,
          }));
          return { procedures: data, length: resp.length };
        })
      );
  }
  getDetailsDependentsByUnit() {
    return this.http.get<dependentDetails[]>(`${base_url}/reports/dependents`);
  }

  searchProcedureByUnit({ limit, offset }: PaginationParameters, form: Object) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .post<{ communications: communicationResponse[]; length: number }>(
        `${base_url}/reports/unit`,
        this.getValidFormParameters(form),
        { params }
      )
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

  getTotalProceduresByInstitution({ id_institution, group, collection, participant }: totalReportParams) {
    let params = new HttpParams().set('group', group);
    if (participant) params = params.append('participant', participant);
    return this.http
      .get<ReportTotalProcedures[]>(`${base_url}/reports/total/${collection}/${id_institution}`, { params })
      .pipe(
        map((response) => {
          const data = response.map((element) => {
            const details = element.details.reduce<{ [key: string]: number }>((acc, { count, field }) => {
              acc[field] = count;
              return acc;
            }, {});
            return {
              dependency: element.name,
              total: element.total,
              ...details,
            };
          });
          return data;
        })
      );
  }
}
