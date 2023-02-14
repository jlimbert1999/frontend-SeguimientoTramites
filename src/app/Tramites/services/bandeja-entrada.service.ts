import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BandejaEntradaService {
  offset: number = 0;
  limit: number = 10;
  length: number = 0;
  Mails: any[] = [];

  constructor(private http: HttpClient) {}

  Get() {
    const params = new HttpParams()
      .set('offset', this.offset)
      .set('limit', this.limit);
    return this.http
      .get<{ ok: boolean; mails: any[]; length: number }>(
        `${base_url}/bandejas/entrada`,
        { params }
      )
      .pipe(
        map((resp) => {
          this.length = resp.length;
          console.log(resp.mails)
          this.Mails = resp.mails;
        })
      );
  }
}
