import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ReporteService {


  constructor(private http: HttpClient) { }
  getReporteFicha(group: any, paramsforSearch: any) {
    const params = new HttpParams({ fromObject: this.filterEmptyFields(paramsforSearch) })
    return this.http.get<{ ok: boolean, tramites: any }>(`${base_url}/reportes/ficha/${group}`, { params }).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
  getReportByAccount(group: any, paramsforSearch: any) {
    const params = new HttpParams({ fromObject: this.filterEmptyFields(paramsforSearch) })
    return this.http.get<{ ok: boolean, procedures: any[] }>(`${base_url}/reportes/account/procedures/${group}`, { params }).pipe(
      map(resp => {
        return resp.procedures
      })
    )
  }
  getReportByUnit(group: any, paramsforSearch: any) {
    const params = new HttpParams({ fromObject: this.filterEmptyFields(paramsforSearch) })
    return this.http.get<{ ok: boolean, tramites: any[] }>(`${base_url}/reportes/unit/${group}`, { params }).pipe(
      map(resp => {
        return resp.tramites.map(data => data.tramite)
      })
    )
  }
  getReportByPetitioner(paramsforSearch: any) {
    const params = new HttpParams({ fromObject: this.filterEmptyFields(paramsforSearch) })
    return this.http.get<{ ok: boolean, tramites: any[] }>(`${base_url}/reportes/solicitante`, { params }).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
  getReportByTypeProcedure(group: any, paramsforSearch: any) {
    const params = new HttpParams({ fromObject: this.filterEmptyFields(paramsforSearch) })
    return this.http.get<{ ok: boolean, procedures: any[] }>(`${base_url}/reportes/tipos/${group}`, { params }).pipe(
      map(resp => {
        return resp.procedures
      })
    )
  }
  getReporteBySearch(group: any, paramsforSearch: any, limit: number, offset: number) {
    let params = new HttpParams({ fromObject: this.filterEmptyFields(paramsforSearch) })
    params = params.set('limit', limit)
    params = params.set('offset', offset)
    return this.http.get<{ ok: boolean, procedures: any, length: number }>(`${base_url}/reportes/busqueda/${group}`, { params: params }).pipe(
      map(resp => {
        return { procedures: resp.procedures, length: resp.length }
      })
    )
  }
  // getReporteSearchNotPaginated(grupo: 'INTERNO' | 'EXTERNO', length: number) {
  //   return this.http.get<{ ok: boolean, tramites: | Externo[] | Interno[] }>(`${base_url}/reportes/busqueda/${grupo}?limit=${length}&offset=0`, { params: this.params }).pipe(
  //     map(resp => {
  //       return resp.tramites
  //     })
  //   )
  // }



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
  getTypesProceduresForReports(group: any) {
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
