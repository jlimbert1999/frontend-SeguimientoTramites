import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CuentaData } from '../models/cuenta.model';
import { Funcionario } from '../models/funcionario.interface';
import { CuentaService } from './cuenta.service';
import { PaginationService } from './pagination.service';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  termino_busqueda: string = ""
  busqueda: boolean = false
  constructor(private http: HttpClient) { }
  add(funcionario: Funcionario) {
    return this.http.post<{ ok: boolean, funcionario: Funcionario }>(`${base_url}/configuraciones/funcionarios`, funcionario).pipe(
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
    return this.http.get<{ ok: boolean, funcionarios: Funcionario[], length: number }>(`${base_url}/configuraciones/funcionarios`, { params }).pipe(
      map(resp => {
        return { funcionarios: resp.funcionarios, length: resp.length }
      })
    )
  }
  edit(id_funcionario: string, funcionario: Funcionario) {
    return this.http.put<{ ok: boolean, funcionario: Funcionario }>(`${base_url}/configuraciones/funcionarios/${id_funcionario}`, funcionario).pipe(
      map(resp => resp.funcionario)
    )
  }
  search(limit: number, offset: number, text: string) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, funcionarios: Funcionario[], length: number }>(`${base_url}/configuraciones/funcionarios/search/${text}`, { params }).pipe(
      map(resp => {
        return { funcionarios: resp.funcionarios, length: resp.length }
      })
    )
  }
  searchOne(text: string) {
    return this.http.get<{ ok: boolean, funcionarios: Funcionario[] }>(`${base_url}/configuraciones/funcionarios/search-one/${text}`).pipe(
      map(resp => {
        return resp.funcionarios
      })
    )
  }

  delete(id_funcionario: string) {
    return this.http.delete<{ ok: boolean, funcionario: Funcionario }>(`${base_url}/configuraciones/funcionarios/${id_funcionario}`).pipe(
      map(resp => resp.funcionario)
    )
  }




}
