import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { workflow } from 'src/app/communication/interfaces';
import { groupProcedure, observation } from '../../interfaces';
import { PDF_FichaExterno } from 'src/app/Reportes/pdf/reporte-ficha-externa';
import { ProcedureService } from '../../services/procedure.service';
import { ExternalProcedure, InternalProcedure } from '../../models';

const VALID_ROUTES: {
  [key: string]: groupProcedure;
} = {
  externos: groupProcedure.EXTERNAL,
  internos: groupProcedure.INTERNAL,
};
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  isLoading: boolean = true;
  procedure: InternalProcedure | ExternalProcedure;
  workflow: workflow[] = [];
  observations: observation[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private paginatorService: PaginatorService,
    private procedureService: ProcedureService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      const id: string = params['id'];
      const group: string = params['group'];
      if (!id || !group) {
        this._location.back();
        return;
      }
      if (!Object.keys(VALID_ROUTES).includes(group)) {
        this._location.back();
        return;
      }
      this.procedureService.getFullProcedure(id, VALID_ROUTES[group]).subscribe((data) => {
        this.procedure = data.procedure;
        this.workflow = data.workflow;
        this.observations = data.observations;
        this.isLoading = false;
      });
    });
  }

  backLocation() {
    this.activateRoute.queryParams.subscribe((data) => {
      const searchMode = String(data['search']).toLowerCase();
      this.paginatorService.limit = data['limit'] ?? 10;
      this.paginatorService.offset = data['offset'] ?? 0;
      this.paginatorService.searchMode = searchMode === 'true' ? true : false;
      this._location.back();
    });
  }

  generateFicha() {
    // const List = this.Workflow.length > 0
    //   ? createListWorkflow(this.Workflow, [{ id_root: this.Workflow[0].emisor.cuenta._id, startDate: this.Tramite.fecha_registro }], [])
    //   : []
    // if (this.tipo === 'ficha-externa') {
    //   PDF_FichaExterno(this.Tramite, List, this.Location)
    // }
    // else {
    //   PDF_FichaInterno(this.Tramite, List, this.Location)
    // }
  }
  get external() {
    return this.procedure as ExternalProcedure;
  }
  get internal() {
    return this.procedure as InternalProcedure;
  }
  get group() {
    return groupProcedure;
  }
}
