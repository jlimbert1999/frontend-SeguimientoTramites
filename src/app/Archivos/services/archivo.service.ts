import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  constructor(private http: HttpClient) { }

  Get() {
    // const params = new HttpParams()
    //   .set('offset', this.offset)
    //   .set('limit', this.limit);
    return this.http.get<{ ok: boolean, tramites: any[] }>(`${base_url}/archivos`)
      .pipe(
        map((resp) => {
          console.log(resp)
          return resp.tramites
        })
      );
  }
}
