import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { external, groupProcedure, internal, observation, stateProcedure } from '../interfaces';
import { ExternalProcedure, InternalProcedure } from '../models';
import { workflowResponse } from 'src/app/communication/interfaces';
import { Workflow } from 'src/app/communication/models';
@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  base_url = environment.base_url;
  constructor(private http: HttpClient) {}

  getFullProcedure(id: string, group: groupProcedure) {
    return this.http
      .get<{
        procedure: internal | external;
        workflow: workflowResponse[];
        observations: observation[];
      }>(`${this.base_url}/procedure/${group}/${id}`)
      .pipe(
        map((resp) => {
          let Procedure: ExternalProcedure | InternalProcedure;
          switch (resp.procedure.group) {
            case groupProcedure.EXTERNAL:
              Procedure = ExternalProcedure.ResponseToModel(resp.procedure as external);
              break;
            default:
              Procedure = InternalProcedure.ResponseToModel(resp.procedure as internal);
              break;
          }
          return {
            procedure: Procedure,
            workflow: resp.workflow.map((el) => Workflow.fromResponse(el)),
            observations: resp.observations,
          };
        })
      );
  }

  addObservation(id_procedure: string, description: string) {
    return this.http.post<observation>(`${this.base_url}/procedure/${id_procedure}/observation`, {
      description,
    });
  }
  repairObservation(id_observation: string) {
    return this.http
      .put<{ state: stateProcedure }>(`${this.base_url}/procedure/observation/${id_observation}`, {})
      .pipe(map((resp) => resp.state));
  }
}
