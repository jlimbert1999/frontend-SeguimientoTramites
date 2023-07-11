import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { dependency } from '../interfaces/dependency.interface';
import { institution } from '../interfaces/institution.interface';
import { CreateDependencyDto } from '../dto/dependency.dto';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class DependenciasService {
  constructor(private http: HttpClient) { }
  getInstitutions() {
    return this.http.get<institution[]>(`${base_url}/dependencies/institutions`).pipe(
      map(resp => resp)
    )
  }

  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ dependencies: dependency[], length: number }>(`${base_url}/dependencies`, { params }).pipe(
      map(resp => {
        return { dependencies: resp.dependencies, length: resp.length }
      })
    )
  }
  search(limit: number, offset: number, text: string) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ dependencies: dependency[], length: number }>(`${base_url}/dependencies/search/${text}`, { params }).pipe(
      map(resp => {
        return { dependencies: resp.dependencies, length: resp.length }
      })
    )
  }
  add(dependencia: CreateDependencyDto) {
    return this.http.post<dependency>(`${base_url}/dependencies`, dependencia).pipe(
      map(resp => {
        console.log(resp);
        return resp
      })
    )
  }

  edit(id_dependency: string, { institucion, ...updateDependencyData }: CreateDependencyDto) {
    return this.http.put<dependency>(`${base_url}/dependencies/${id_dependency}`, updateDependencyData).pipe(
      map(resp => resp)
    )
  }

  delete(id_dependency: string) {
    return this.http.delete<boolean>(`${base_url}/dependencies/${id_dependency}`).pipe(
      map(resp => resp)
    )
  }

}
