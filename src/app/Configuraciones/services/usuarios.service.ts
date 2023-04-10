import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Funcionario } from '../models/funcionario.interface';
import { CuentaService } from './cuenta.service';
import { PaginationService } from './pagination.service';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor(private http: HttpClient) { }
  add(funcionario: Funcionario) {
    return this.http.post<{ ok: boolean, funcionario: Funcionario }>(`${base_url}/funcionarios`, funcionario).pipe(
      map(resp => {
        return resp.funcionario
      })
    )
  }
  agregar_multiples_funcionarios(funcionarios: Funcionario[]) {
    return this.http.post<{ ok: boolean, funcionarios: Funcionario }>(`${base_url}/usuarios/cargar`, { funcionarios }).pipe(
      map(resp => {
        return resp.funcionarios
      })
    )
  }

  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, funcionarios: Funcionario[], length: number }>(`${base_url}/funcionarios`, { params }).pipe(
      map(resp => {
        return { funcionarios: resp.funcionarios, length: resp.length }
      })
    )
  }
  edit(id_funcionario: string, funcionario: Funcionario) {
    return this.http.put<{ ok: boolean, funcionario: Funcionario }>(`${base_url}/funcionarios/${id_funcionario}`, funcionario).pipe(
      map(resp => resp.funcionario)
    )
  }
  search(limit: number, offset: number, text: string) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, funcionarios: Funcionario[], length: number }>(`${base_url}/funcionarios/search/${text}`, { params }).pipe(
      map(resp => {
        return { funcionarios: resp.funcionarios, length: resp.length }
      })
    )
  }
  delete(id_funcionario: string) {
    return this.http.delete<{ ok: boolean, funcionario: Funcionario }>(`${base_url}/funcionarios/${id_funcionario}`).pipe(
      map(resp => resp.funcionario)
    )
  }




}
