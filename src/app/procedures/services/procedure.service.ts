import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { external, groupProcedure, internal } from '../interfaces';
import { workflow } from 'src/app/communication/interfaces';
import { map } from 'rxjs';
import { ExternalProcedure, InternalProcedure, Procedure } from '../models';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  constructor(private http: HttpClient) {}             

  getFullProcedure(id_procedure: string) {
    return this.http
      .get<{
        procedure: internal | external;
        workflow: workflow[];
      }>(`${base_url}/procedure/${id_procedure}`)
      .pipe(
        map((resp) => {
          const procedure =
            resp.procedure.group === groupProcedure.EXTERNAL
              ? ExternalProcedure.fromJson(resp.procedure as external)
              : resp.procedure.group === groupProcedure.INTERNAL
              ? InternalProcedure.fromJson(resp.procedure as internal)
              : new Procedure(resp.procedure);
          return {
            procedure: ExternalProcedure.fromJson(resp.procedure as external),
            workflow: resp.workflow,
          };
        })
      );
  }
}
