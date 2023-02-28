import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, elementAt, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AllInfoOneInterno } from '../../Internos/models/interno.model';
import { BandejaEntradaData, BandejaSalidaModel_View, EnvioModel, MailDetails, UsersMails } from '../models/mail.model';
import { NotificationsService } from './notifications.service';
import { SocketService } from './socket.service';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class BandejaService {

  constructor(private http: HttpClient, private notificatonService: NotificationsService) { }
  
  DataMailsIn: BandejaEntradaData[] = [];
  PaginationMailsIn = {
    limit: 10,
    offset: 0,
    total: 0
  }
  searchOptionsIn = {
    active: false,
    type: "",
    text: ""
  }


  getInstituciones() {
    return this.http.get<{ ok: boolean, instituciones: any }>(`${base_url}/bandejas/instituciones`).pipe(
      map(resp => {
        return resp.instituciones
      })
    )
  }
  getDependencias(id_institucion: string) {
    return this.http.get<{ ok: boolean, dependencias: any }>(`${base_url}/bandejas/dependencias/${id_institucion}`).pipe(
      map(resp => {
        return resp.dependencias
      })
    )
  }

  // getUsersForSend(id_dependencia: string) {
  //   return this.http.get<{ ok: boolean, data: any[] }>(`${base_url}/bandejas/users/${id_dependencia}`).pipe(
  //     map(resp => {
  //       let users: UsersMails[] = []
  //       resp.data.map(user => {
  //         users.push({
  //           id_cuenta: user._id,
  //           fullname: `${user.funcionario.nombre} ${user.funcionario.paterno} ${user.funcionario.materno}`,
  //           jobtitle: `${user.funcionario.cargo}`,
  //           online: false
  //         })
  //       })
  //       return users
  //     })
  //   )
  // }
  getUsersForSend(text: string) {
    return this.http.get<{ ok: boolean, cuentas: UsersMails[] }>(`${base_url}/bandejas/users/${text}`).pipe(
      map(resp => {
        return resp.cuentas
      })
    )
  }
  AddMail(data: any) {
    return this.http.post<{ ok: boolean, mails: any[] }>(`${base_url}/bandejas`, data).pipe(
      map(resp => {
        return resp.mails
      })
    )
  }
  getmMailsIn() {
    return this.http.get<{ ok: boolean, data: { tramites: any, total: number } }>(`${base_url}/bandejas/entrada?limit=${this.PaginationMailsIn.limit}&offset=${this.PaginationMailsIn.offset}`).pipe(
      map(resp => {
        this.notificatonService.number_mails.next(resp.data.total)
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
        return resp.mail
      })
    )
  }

  searchMailsIn() {
    let params = new HttpParams()
      .set('type', this.searchOptionsIn.type)
      .set('limit', this.PaginationMailsIn.limit)
      .set('offset', this.PaginationMailsIn.offset)
    return this.http.get<{ ok: boolean, mails: any, total: number }>(`${base_url}/bandejas/search-interno/${this.searchOptionsIn.text}`, { params }).pipe(
      map(resp => {
        this.PaginationMailsIn.total = resp.total
        this.DataMailsIn = resp.mails
      })
    )
  }

  getMailExterno(id_tramite: string) {
    return this.http.get<{ ok: boolean, tramite: AllInfoOneInterno, workflow: any[] }>(`${base_url}/bandejas/externo/${id_tramite}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }
  getMailInterno(id_tramite: string) {
    return this.http.get<{ ok: boolean, tramite: AllInfoOneInterno, workflow: any[] }>(`${base_url}/bandejas/interno/${id_tramite}`).pipe(
      map(resp => {
        return { tramite: resp.tramite, workflow: resp.workflow }
      })
    )
  }

  addMail(mail: BandejaEntradaData) {
    this.PaginationMailsIn.total += 1
    this.DataMailsIn = [mail, ...this.DataMailsIn]
  }




}
