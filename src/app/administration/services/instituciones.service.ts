import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationService } from './pagination.service';
import { institution } from '../interfaces/institution.interface';
import { CreateInstitutionDto } from '../dto/institution.dto';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class InstitucionesService {
  constructor(private http: HttpClient, private paginationService: PaginationService) { }

  add(institucion: CreateInstitutionDto) {
    return this.http.post<institution>(`${base_url}/institutions`, institucion).pipe(
      map(resp => resp)
    )
  }
  search(limit: number, offset: number, termino: string) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ institutions: institution[], length: number }>(`${base_url}/institutions/search/${termino}`, { params }).pipe(
      map(resp => {
        return { institutions: resp.institutions, length: resp.length }
      })
    )
  }
  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ ok: boolean, institutions: institution[], length: number }>(`${base_url}/institutions`, { params }).pipe(
      map(resp => {
        return { institutions: resp.institutions, length: resp.length }
      })
    )
  }
  edit(id_institution: string, institucion: institution) {
    return this.http.put<institution>(`${base_url}/institutions/${id_institution}`, institucion).pipe(
      map(resp => resp)
    )
  }
  delete(id_institucion: string) {
    return this.http.delete<boolean>(`${base_url}/institutions/${id_institucion}`).pipe(
      map(resp => resp)
    )
  }

}
