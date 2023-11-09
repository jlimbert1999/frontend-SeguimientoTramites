import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { external, groupProcedure, internal, observation, stateProcedure } from '../interfaces';
import { ExternalProcedure, InternalProcedure } from '../models';
import { workflow } from 'src/app/communication/interfaces';
const base_url = environment.base_url;

type VALID_PROCEDURE = internal | external;
@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  constructor(private http: HttpClient) {}

  getFullProcedure(id_procedure: string, group: groupProcedure) {
    return this.http
      .get<{
        procedure: VALID_PROCEDURE;
        workflow: workflow[];
        observations: observation[];
      }>(`${base_url}/procedure/${group}/${id_procedure}`)
      .pipe(
        map((resp) => {
          let Procedure: ExternalProcedure | InternalProcedure;
          switch (resp.procedure.group) {
            case groupProcedure.EXTERNAL:
              Procedure = ExternalProcedure.toModel(resp.procedure);
              break;
            default:
              Procedure = InternalProcedure.toModel(resp.procedure);
              break;
          }
          return {
            procedure: Procedure,
            workflow: resp.workflow,
            observations: resp.observations,
          };
        })
      );
  }

  addObservation(id_procedure: string, description: string) {
    return this.http.post<observation>(`${base_url}/procedure/${id_procedure}/observation`, {
      description,
    });
  }
  repairObservation(id_observation: string) {
    return this.http
      .put<{ state: stateProcedure }>(`${base_url}/procedure/observation/${id_observation}`, {})
      .pipe(map((resp) => resp.state));
  }
}
