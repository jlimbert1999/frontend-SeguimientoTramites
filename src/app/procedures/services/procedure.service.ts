import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { external, groupProcedure, internal, observation } from '../interfaces';
import { ExternalProcedure, InternalProcedure } from '../models';
import { workflow } from 'src/app/communication/interfaces';
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  constructor(private http: HttpClient) {}

  getFullProcedure(id_procedure: string, group: groupProcedure) {
    return this.http
      .get<{
        procedure: internal | external;
        workflow: workflow[];
        observations: observation[];
      }>(`${base_url}/procedure/${group}/${id_procedure}`)
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
