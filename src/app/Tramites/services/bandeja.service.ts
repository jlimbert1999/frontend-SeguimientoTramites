import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, elementAt, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BandejaEntradaData, BandejaSalidaModel_View, EnvioModel, MailDetails, UsersMails } from '../models/mail.model';
import { SocketService } from './socket.service';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class BandejaService {

  constructor(private http: HttpClient) { }
  DataMailsIn: BandejaEntradaData[] = [];
  PaginationMailsIn = {
    limit: 10,
    offset: 0,
    total: 0
  }

  obtener_instituciones_envio() {
    return this.http.get<{ ok: boolean, instituciones: any }>(`${base_url}/bandejas/instituciones`).pipe(
      map(resp => {
        return resp.instituciones
      })
    )
  }
  obtener_dependencias_envio(id_institucion: string) {
    return this.http.get<{ ok: boolean, dependencias: any }>(`${base_url}/bandejas/dependencias/${id_institucion}`).pipe(
      map(resp => {
        return resp.dependencias
      })
    )
  }

  getUsersForSend(id_dependencia: string) {
    return this.http.get<{ ok: boolean, data: any[] }>(`${base_url}/bandejas/users/${id_dependencia}`).pipe(
      map(resp => {
        let users: UsersMails[] = []
        resp.data.map(user => {
          users.push({
            id_cuenta: user._id,
            fullname: `${user.funcionario.nombre} ${user.funcionario.paterno} ${user.funcionario.materno}`,
            jobtitle: `${user.funcionario.cargo}`,
            online: false
          })
        })
        return users
      })
    )
  }
  agregar_mail(data: EnvioModel) {
    return this.http.post<{ ok: boolean, tramite: any }>(`${base_url}/bandejas`, data).pipe(
      map(resp => {
        return resp.tramite
      })
    )
  }
  getmMailsIn() {
    return this.http.get<{ ok: boolean, data: { tramites: any, total: number } }>(`${base_url}/bandejas/entrada?limit=${this.PaginationMailsIn.limit}&offset=${this.PaginationMailsIn.offset}`).pipe(
      map(resp => {
        this.PaginationMailsIn.total = resp.data.total
        this.DataMailsIn = resp.data.tramites
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
        resp.mail.emisor.funcionario.fullname = `${resp.mail.emisor.funcionario.nombre} ${resp.mail.emisor.funcionario.paterno} ${resp.mail.emisor.funcionario.materno}`
        return resp.mail
      })
    )
  }

}
