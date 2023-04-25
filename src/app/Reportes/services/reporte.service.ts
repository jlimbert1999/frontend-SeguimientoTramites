import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Externo } from 'src/app/Tramites/models/Externo.interface';
import { WorkflowData } from 'src/app/Bandejas/models/workflow.interface';
import { Interno } from 'src/app/Tramites/models/Interno.interface';
import { groupProcedure } from 'src/app/Tramites/models/ProceduresProperties';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  limit: number = 10
  offset: number = 0
  length: number = 0
  grupo: 'INTERNO' | 'EXTERNO'
  params: HttpParams
  searchParams: any = {}

  constructor(private http: HttpClient) { }
  getReporteFicha(group: groupProcedure, paramsforSearch: any) {
    const params = new HttpParams({ fromObject: this.filterEmptyFields(paramsforSearch) })
    return this.http.get<{ ok: boolean, tramites: any }>(`${base_url}/reportes/ficha/${group}`, { params }).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
  getReportByAccount(group: groupProcedure, paramsforSearch: any) {
    const params = new HttpParams({ fromObject: this.filterEmptyFields(paramsforSearch) })
    return this.http.get<{ ok: boolean, procedures: any[] }>(`${base_url}/reportes/account/procedures/${group}`, { params }).pipe(
      map(resp => {
        return resp.procedures
      })
    )
  }
  getReportByUnit(group: groupProcedure, paramsforSearch: any) {
    const params = new HttpParams({ fromObject: this.filterEmptyFields(paramsforSearch) })
    return this.http.get<{ ok: boolean, tramites: any[] }>(`${base_url}/reportes/unit/${group}`, { params }).pipe(
      map(resp => {
        return resp.tramites.map(data => data.tramite)
      })
    )
  }
  getReporteSearch() {
    this.params = new HttpParams({ fromObject: this.searchParams })
    this.params = this.params.set('limit', this.limit)
    this.params = this.params.set('offset', this.offset)
    return this.http.get<{ ok: boolean, tramites: any, length: number }>(`${base_url}/reportes/busqueda/${this.grupo}`, { params: this.params }).pipe(
      map(resp => {
        this.length = resp.length
        console.log(resp.tramites)
        return resp.tramites
      })
    )
  }
  getReporteSearchNotPaginated(grupo: 'INTERNO' | 'EXTERNO', length: number) {
    return this.http.get<{ ok: boolean, tramites: | Externo[] | Interno[] }>(`${base_url}/reportes/busqueda/${grupo}?limit=${length}&offset=0`, { params: this.params }).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }


  getReporteSolicitante(params: any) {
    params = new HttpParams({ fromObject: params })
    return this.http.get<{ ok: boolean, tramites: any[] }>(`${base_url}/reportes/solicitante`, { params }).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
  getReporteRepresentante(params: any, dateInit: Date | null, dateEnd: Date | null) {
    params = new HttpParams({ fromObject: params })
    if (dateInit) {
      params = params.set('dateInit', dateInit.toISOString())
    }
    if (dateEnd) {
      params = params.set('dateEnd', dateEnd.toISOString())
    }
    return this.http.get<{ ok: boolean, tramites: any[] }>(`${base_url}/reportes/representante`, { params }).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }



  getInstitucionesForReports() {
    return this.http.get<{ ok: boolean, instituciones: any[] }>(`${base_url}/reportes/instituciones`).pipe(
      map(resp => {
        return resp.instituciones
      })
    )
  }
  getDependenciasForReports(id_institucion: string) {
    return this.http.get<{ ok: boolean, dependencias: any[] }>(`${base_url}/reportes/dependencias/${id_institucion}`).pipe(
      map(resp => {
        return resp.dependencias
      })
    )
  }
  getUsersForReports(id_dependencia: string) {
    return this.http.get<{ ok: boolean, users: any[] }>(`${base_url}/reportes/users/${id_dependencia}`).pipe(
      map(resp => {
        resp.users.map(account => {
          account.funcionario['fullname'] = `${account.funcionario.nombre} ${account.funcionario.paterno} ${account.funcionario.materno}`
        })
        return resp.users
      })
    )
  }
  getAccountsByText(text: string) {
    return this.http.get<{ ok: boolean, accounts: any[] }>(`${base_url}/reportes/accounts/${text}`).pipe(
      map(resp => {
        return resp.accounts
      })
    )
  }
  getTypesProceduresForReports(group: groupProcedure) {
    return this.http.get<{ ok: boolean, types: any[] }>(`${base_url}/reportes/types/${group}`).pipe(
      map(resp => {
        return resp.types
      })
    )
  }


  filterEmptyFields(queryParams: any): any {
    let filteredFields: any = {};
    for (let key in queryParams) {
      if (queryParams[key] !== '' && queryParams[key] !== null) {
        if (key === 'end' || key === 'start') filteredFields[key] = queryParams[key].toISOString()
        else filteredFields[key] = queryParams[key]
      }
    }
    return filteredFields
  }
}
