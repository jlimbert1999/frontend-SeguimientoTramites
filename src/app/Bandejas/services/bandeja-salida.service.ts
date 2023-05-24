import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GroupedMails, GroupedResponse } from '../models/salida.interface';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class BandejaSalidaService {
  constructor(private http: HttpClient) { }

  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
    return this.http.get<{ ok: boolean, mails: GroupedResponse[], length: number }>(
      `${base_url}/salidas`, { params }).pipe(
        map(resp => {
          const orderMails: GroupedMails[] = resp.mails.map<GroupedMails>(
            ({ _id: { tramite, ...rootData }, sendings }) => {
              sendings.map(send => {
                if (send.receptor.funcionario === undefined) {
                  send.receptor.funcionario = { nombre: send.receptor.usuario, paterno: '', materno: '', cargo: send.receptor.cargo, _id: '' }
                }
                return send
              })
              // sendings.map(send => send.receptor.funcionario ? send.receptor.funcionario.cargo === '')
              return { tramite: sendings[0].tramite, ...rootData, sendings }
            })
          return { mails: orderMails, length: resp.length }
        })
      )
  }
  Search(limit: number, offset: number, type: 'INTERNO' | 'EXTERNO', text: string) {
    let params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('text', text)
    return this.http.get<{ ok: boolean, mails: GroupedResponse[], length: number }>(`${base_url}/salidas/search/${type}`, { params }).pipe(
      map(resp => {
        const orderMails: GroupedMails[] = resp.mails.map<GroupedMails>(
          ({ _id: { tramite, ...rootData }, sendings }) => {
            return { tramite: sendings[0].tramite, ...rootData, sendings }
          })
        return { mails: orderMails, length: resp.length }
      })
    )
  }

  cancelOneSend(id_bandeja: string) {
    return this.http.delete<{ ok: boolean, message: string }>(
      `${base_url}/salidas/${id_bandeja}`).pipe(
        map(resp => {
          return resp.message
        })
      )
  }
  cancelAllSend(id_tramite: string, fecha_envio: string) {
    return this.http.put<{ ok: boolean, message: string }>(
      `${base_url}/salidas/all/${id_tramite}`, { fecha_envio }).pipe(
        map(resp => {
          return resp.message
        })
      )
  }
}
