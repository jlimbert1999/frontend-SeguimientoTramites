import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ReporteEstadisticoService {

  constructor(private http: HttpClient) { }
  getInfoInstituciones() {
    return this.http.get<{ ok: boolean, data: any[] }>(`${base_url}/reportes/estadistico/instituciones`).pipe(
      map(resp => {
        return resp.data
      })
    )
  }
}
