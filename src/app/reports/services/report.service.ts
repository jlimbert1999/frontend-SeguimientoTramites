import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { groupProcedure } from 'src/app/procedures/interfaces';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  searchProcedureByCode(code: string) {
    const params = new HttpParams().set('code', code);
    return this.http.get<{ _id: string; group: groupProcedure }>(`${base_url}/reports/procedure/code`, { params });
  }
}
