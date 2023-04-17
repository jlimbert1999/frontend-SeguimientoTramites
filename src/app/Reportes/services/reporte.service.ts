import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Externo } from 'src/app/Tramites/models/Externo.interface';
import { WorkflowData } from 'src/app/Bandejas/models/workflow.interface';
import { Interno } from 'src/app/Tramites/models/Interno.interface';
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
  getReporteFicha(alterno: string, group: 'externo' | 'interno') {
    return this.http.get<{ ok: boolean, tramites: any }>(`${base_url}/reportes/ficha/${alterno}?group=${group}`).pipe(
      map(resp => {
        return resp.tramites
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

  getReportByUnit(params: any, group: 'tramites_externos' | 'tramites_internos') {
    params = new HttpParams({ fromObject: params })
    return this.http.get<{ ok: boolean, tramites: any[] }>(`${base_url}/reportes/unit/${group}`, { params }).pipe(
      map(resp => {
        return resp.tramites.map(data => data.tramite)
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
  getTypesProceduresForReports(group: 'tramites_externos' | 'tramites_internos') {
    let typeGroup = group === 'tramites_externos' ? 'EXTERNO' : 'INTERNO'
    return this.http.get<{ ok: boolean, types: any[] }>(`${base_url}/reportes/types/${typeGroup}`).pipe(
      map(resp => {
        return resp.types
      })
    )
  }
}
