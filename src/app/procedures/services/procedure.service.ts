import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { external, groupProcedure, internal, observation } from '../interfaces';
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
        observations: observation[];
      }>(`${base_url}/procedure/${id_procedure}`)
      .pipe(
        map((resp) => {
          const Procedure =
            resp.procedure.group === groupProcedure.EXTERNAL
              ? ExternalProcedure.fromJson(resp.procedure)
              : InternalProcedure.fromJson(resp.procedure);
          return {
            procedure: Procedure,
            workflow: resp.workflow,
            observations: resp.observations,
          };
        })
      );
  }
}
