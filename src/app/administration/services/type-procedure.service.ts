import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginationParameters } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';
import { typeProcedure } from '../interfaces/typeProcedure.interface';
import { TypeProcedureDto } from '../dto';

interface SearchParams extends PaginationParameters {
  term: string;
}
@Injectable({
  providedIn: 'root',
})
export class TypeProcedureService {
  base_url = environment.base_url;
  constructor(private http: HttpClient) {}

  getSegments() {
    return this.http.get<string[]>(`${this.base_url}/types-procedures/segments`);
  }
  search({ term, ...values }: SearchParams) {
    const params = new HttpParams({ fromObject: { ...values } });
    return this.http.get<{ types: typeProcedure[]; length: number }>(
      `${this.base_url}/types-procedures/search/${term}`,
      {
        params,
      }
    );
  }

  findAll(paginationParams: PaginationParameters) {
    const params = new HttpParams({ fromObject: { ...paginationParams } });
    return this.http.get<{ types: typeProcedure[]; length: number }>(`${this.base_url}/types-procedures`, {
      params,
    });
  }

  add(form: Object) {
    const type = TypeProcedureDto.FormToModel(form);
    console.log(type);
    return this.http.post<typeProcedure>(`${this.base_url}/types-procedures`, type);
  }

  edit(id: string, typeProcedure: Partial<TypeProcedureDto>) {
    console.log(typeProcedure);
    return this.http.put<typeProcedure>(`${this.base_url}/types-procedures/${id}`, typeProcedure);
  }

  delete(id_tipoTramite: string) {
    return this.http.delete<{ activo: boolean }>(`${this.base_url}/types-procedures/${id_tipoTramite}`);
  }
}
