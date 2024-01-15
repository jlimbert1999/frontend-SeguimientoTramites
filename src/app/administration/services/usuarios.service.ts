import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { CreateOfficerDto } from '../dto/officer.dto';
import { officer } from '../interfaces/oficer.interface';
import { workHistory } from '../interfaces/workHistory.interface';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor(private http: HttpClient) { }
  add(officer: any, image: File | undefined) {
    let formData = new FormData();
    // for (const [key, value] of Object.entries(officer)) {
    //   formData.append(key, any);
    // }
    if (image) formData.append("image", image);
    return this.http.post<officer>(`${base_url}/officer`, formData).pipe(
      map(resp => resp)
    )
  }

  agregar_multiples_funcionarios(funcionarios: any[]) {
    return this.http.post<{ ok: boolean, funcionarios: any }>(`${base_url}/usuarios/cargar`, { funcionarios }).pipe(
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

  edit(id_officer: string, officer: officer) {
    return this.http.put<officer>(`${base_url}/officer/${id_officer}`, officer).pipe(
      map(resp => resp)
    )
  }

  delete(id_officer: string) {
    return this.http.delete<officer>(`${base_url}/officer/${id_officer}`).pipe(
      map(resp => resp))
  }

  getWorkHistory(id_officer: string, limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<workHistory[]>(`${base_url}/officer/history/${id_officer}`, { params }).pipe(
      map(resp => resp)
    )
  }
}
