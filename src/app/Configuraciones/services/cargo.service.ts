import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { job } from '../interfaces/job.interface';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CargoService {

  constructor(private http: HttpClient) { }

  searchSuperior(text: string) {
    return this.http.get<job[]>(`${base_url}/jobs/superiors/${text}`).pipe(
      map(resp => resp)
    )
  }

  get(limit: number, offset: number) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ jobs: job[], length: number }>(`${base_url}/jobs`, { params }).pipe(
      map(resp => {
        return { jobs: resp.jobs, length: resp.length }
      })
    )
  }
  search(limit: number, offset: number, text: string) {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
    return this.http.get<{ jobs: job[], length: number }>(`${base_url}/jobs/${text}`, { params }).pipe(
      map(resp => {
        return { jobs: resp.jobs, length: resp.length }
      })
    )
  }
  edit(id: string, job: job) {
    return this.http.put<job>(`${base_url}/jobs/${id}`, job).pipe(
      map(resp => resp)
    )
  }
}
