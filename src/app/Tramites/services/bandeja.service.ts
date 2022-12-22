import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { elementAt, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BandejaEntradaData, BandejaSalidaModel_View, EnvioModel, MailDetails, UsersMails } from '../models/mail.model';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class BandejaService {

  constructor(private http: HttpClient) { }
  dataSource: BandejaEntradaData[] = [];
  obtener_instituciones_envio() {
    return this.http.get<{ ok: boolean, instituciones: any }>(`${base_url}/bandejas/instituciones-envio`).pipe(
      map(resp => {
        return resp.instituciones
      })
    )
  }
  obtener_dependencias_envio(id_institucion: string) {
    return this.http.get<{ ok: boolean, dependencias: any }>(`${base_url}/bandejas/dependencias-envio/${id_institucion}`).pipe(
      map(resp => {
        return resp.dependencias
      })
    )
  }
  obtener_funcionarios_envio(id_dependencia: string) {
    return this.http.get<{ ok: boolean, funcionarios: UsersMails[] }>(`${base_url}/bandejas/funcionarios-envio/${id_dependencia}`).pipe(
      map(resp => {
        return resp.funcionarios
      })
    )
  }
  agregar_mail(data: EnvioModel) {
    return this.http.post<{ ok: boolean, tramite: any }>(`${base_url}/bandejas`, data).pipe(
      map(resp => {
        console.log(resp.tramite)
        return resp.tramite
      })
    )
  }
  obtener_bandejaEntrada() {
    return this.http.get<{ ok: boolean, tramites: any[] }>(`${base_url}/bandejas/entrada`).pipe(
      map(resp => {
        this.dataSource = resp.tramites
      })
    )
  }

  obtener_bandejaSalida() {
    return this.http.get<{ ok: boolean, tramites: BandejaSalidaModel_View[] }>(`${base_url}/bandejas/salida`).pipe(
      map(resp => {
        return resp.tramites
      })
    )
  }
  aceptar_tramite(id_bandeja: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/bandejas/aceptar/${id_bandeja}`, {}).pipe(
      map(resp => {
        return resp.message
      })
    )
  }
  rechazar_tramite(id_bandeja: string, motivo_rechazo: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/bandejas/rechazar/${id_bandeja}`, { motivo_rechazo }).pipe(
      map(resp => {
        return resp.message
      })
    )
  }

  getDetalisMail(id_bandejaEntrada: string) {
    return this.http.get<{ ok: boolean, mail: MailDetails }>(`${base_url}/bandejas/detalle/${id_bandejaEntrada}`).pipe(
      map(resp => {
        return resp.mail
      })
    )
  }

}
