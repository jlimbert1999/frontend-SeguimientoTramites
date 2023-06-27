import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { job, orgChartData } from '../interfaces/job.interface';
import { jobDto } from '../dto/job.dto';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CargoService {

  constructor(private http: HttpClient) { }

  searchJobForOfficer(text: string) {
    return this.http.get<job[]>(`${base_url}/jobs/search/job/officer/${text}`).pipe(
      map(resp => resp)
    )
  }

  searchSuperior(text: string) {
    return this.http.get<job[]>(`${base_url}/jobs/search/dependents/${text}`).pipe(
      map(resp => resp)
    )
  }
  getDependentsOfSuperior(id_superior: string) {
    return this.http.get<job[]>(`${base_url}/jobs/dependents/${id_superior}`).pipe(
      map(resp => resp)
    )
  }
  removeDependent(id_dependent: string) {
    return this.http.delete<job>(`${base_url}/jobs/dependent/${id_dependent}`).pipe(
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
  add(job: jobDto) {
    return this.http.post<job>(`${base_url}/jobs`, job).pipe(
      map(resp => resp)
    )
  }
  edit(id: string, job: jobDto) {
    return this.http.put<job>(`${base_url}/jobs/${id}`, job).pipe(
      map(resp => resp)
    )
  }

  getOrganization() {
    return this.http.get<orgChartData[]>(`${base_url}/jobs/organization`).pipe(
      map(resp => {
        return resp.map(el => {
          el.data.forEach((item, index) => {
            if (item.name === 'Sin funcionario') {
              el.data[index].tags = ["no-user"];
            }
          })
          return el
        })
      })
    )
  }
}
