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
    return this.http.get<{ ok: boolean, archives: any[] }>(`${base_url}/archivos`)
      .pipe(
        map((resp) => {
          console.log(resp.archives);
          return resp.archives
        })
      );
  }

  unarchive(id_archive: string, description: string) {
    return this.http.put<{ ok: boolean, message: string }>(`${base_url}/archivos/${id_archive}`, { description })
      .pipe(map((resp) => {
        return resp.message
      })
      );
  }

}
