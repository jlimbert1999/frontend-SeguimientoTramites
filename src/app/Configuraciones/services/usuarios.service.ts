import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Funcionario } from '../models/funcionario.interface';
import { CuentaService } from './cuenta.service';
import { PaginationService } from './pagination.service';
import { CreateOfficerDto } from '../dto/officer.dto';
import { officer } from '../interfaces/oficer.interface';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor(private http: HttpClient) { }
  add(officer: CreateOfficerDto, image: File | undefined) {
    let formData = new FormData();
    for (const [key, value] of Object.entries(officer)) {
      formData.append(key, value);
    }
    if (image) formData.append("image", image);
    return this.http.post<officer>(`${base_url}/officer`, formData).pipe(
      map(resp => resp)
    )
  }

  agregar_multiples_funcionarios(funcionarios: Funcionario[]) {
    return this.http.post<{ ok: boolean, funcionarios: Funcionario }>(`${base_url}/usuarios/cargar`, { funcionarios }).pipe(
      map(resp => {
        return resp.funcionarios
      })
    )
  }

  search(limit: number, offset: number, text: string) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ officers: officer[], length: number }>(`${base_url}/officer/search/${text}`, { params }).pipe(
      map(resp => {
        return { officers: resp.officers, length: resp.length }
      })

    )
  }
  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, officers: officer[], length: number }>(`${base_url}/officer`, { params }).pipe(
      map(resp => {
        return { officers: resp.officers, length: resp.length }
      })
    )
  }


  edit(id_funcionario: string, funcionario: Funcionario) {
    return this.http.put<{ ok: boolean, funcionario: Funcionario }>(`${base_url}/funcionarios/${id_funcionario}`, funcionario).pipe(
      map(resp => resp.funcionario)
    )
  }

  delete(id_funcionario: string) {
    return this.http.delete<{ ok: boolean, funcionario: Funcionario }>(`${base_url}/funcionarios/${id_funcionario}`).pipe(
      map(resp => resp.funcionario)
    )
  }




}
