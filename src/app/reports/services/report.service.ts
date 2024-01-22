import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { external, groupProcedure, procedure } from 'src/app/procedures/interfaces';
import { account, institution, typeProcedure } from 'src/app/administration/interfaces';
import { PaginationParameters } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';
import {
  ProcedureTableData,
  ReportTotalProcedures,
  TotalMailsUser,
  dependentDetails,
  totalReportParams,
  workDetails,
} from '../interfaces';
import { communicationResponse, statusMail } from 'src/app/communication/interfaces';

interface SearchProceduresParamsDto extends PaginationParameters {
  code: string;
  group?: groupProcedure;
}
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  base_url = environment.base_url;
  constructor(private http: HttpClient) {}
  public removeEmptyValuesFromObject(form: Object) {
    return Object.entries(form).reduce((acc, [key, value]) => (value ? { ...acc, [key]: value } : acc), {});
  }

  getProceduresByText(text: string) {
    return this.http.get<typeProcedure[]>(`${this.base_url}/reports/types-procedures/${text}`);
  }

  getOfficersInMyDependency() {
    return this.http.get<account[]>(`${this.base_url}/reports/dependency/accounts`);
  }

  getInstitutions() {
    return this.http.get<institution[]>(`${this.base_url}/reports/institutions`);
  }

  searchProcedureByCode(code: string) {
    const params = new HttpParams().set('code', code);
    return this.http.get<{ _id: string; group: groupProcedure }>(`${this.base_url}/reports/procedure/code`, { params });
  }
  searchProceduresByCode({ group, ...values }: SearchProceduresParamsDto) {
    const params = new HttpParams({ fromObject: { ...values, ...(group && { group }) } });
    return this.http
      .get<{ procedures: procedure[]; length: number }>(`${this.base_url}/reports/procedures`, {
        params,
      })
      .pipe(
        map((resp) => {
          const data = resp.procedures.map((procedure) => ({
            id_procedure: procedure._id,
            group: procedure.group,
            code: procedure.code,
            reference: procedure.reference,
            state: procedure.state,
            date: procedure.startDate,
          }));
          return { procedure: data, length: resp.length };
        })
      );
  }
  searchProcedureByApplicant(
    { limit, offset }: PaginationParameters,
    applicantProps: Object,
    type: 'solicitante' | 'representante'
  ) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .post<{ procedures: external[]; length: number }>(`${this.base_url}/reports/applicant/${type}`, applicantProps, {
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
        `${this.base_url}/reports/procedure`,
        this.removeEmptyValuesFromObject(form),
        { params }
      )
      .pipe(
        map((resp) => {
          const data: ProcedureTableData[] = resp.procedures.map(
            ({ _id, code, reference, startDate, state, group }) => ({
              id_procedure: _id,
              date: startDate,
              reference,
              state,
              group,
              code,
            })
          );
          return { procedures: data, length: resp.length };
        })
      );
  }
  getDetailsDependentsByUnit() {
    return this.http.get<dependentDetails[]>(`${this.base_url}/reports/dependents`);
  }

  searchProcedureByUnit({ limit, offset }: PaginationParameters, form: Object) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .post<{ communications: communicationResponse[]; length: number }>(
        `${this.base_url}/reports/unit`,
        this.removeEmptyValuesFromObject(form),
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
      .get<ReportTotalProcedures[]>(`${this.base_url}/reports/total/${collection}/${id_institution}`, { params })
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
  getRankingUsers() {
    return this.http.get<TotalMailsUser[]>(`${this.base_url}/reports/ranking/accounts`).pipe(
      map((resp) => {
        const data = resp.map((element) => {
          if (Object.keys(element._id.funcionario!).length === 0) {
            element._id.funcionario = undefined;
            return element;
          }
          if (Object.keys(element._id.funcionario!.cargo!).length === 0) {
            element._id.funcionario!.cargo = undefined;
            return element;
          }
          return element;
        });
        return data;
      })
    );
  }
  getAccountInbox() {
    return this.http
      .get<{ account: account; inbox: communicationResponse[] }>(`${this.base_url}/reports/pendings`)
      .pipe(
        map((resp) => {
          return { accont: resp.account, inbox: resp.inbox };
        })
      );
  }
  getWorkDetails(id_account: string) {
    return this.http.get<workDetails[]>(`${this.base_url}/reports/work/${id_account}`).pipe(
      map((resp) => {
        const labels = {
          [statusMail.Pending]: 'PENDIENTES',
          [statusMail.Archived]: 'ARCHIVADOS',
          [statusMail.Received]: 'RECIBIDOS',
          [statusMail.Completed]: 'ATENDIDOS',
          [statusMail.Rejected]: 'RECHAZADOSS',
        };
        return resp
          .map((item) => ({ label: labels[item._id], value: item.count }))
          .sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));
      })
    );
  }
}
