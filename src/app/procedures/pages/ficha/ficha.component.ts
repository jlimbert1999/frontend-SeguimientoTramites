import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { workflow } from 'src/app/communication/interfaces';
import { eventProcedure, groupProcedure } from '../../interfaces';
import { ExternalProcedure } from '../../models';
import { InternalProcedure } from '../../models/internal.model';
import { PDF_FichaExterno } from 'src/app/Reportes/pdf/reporte-ficha-externa';
import { ProcedureService } from '../../services/procedure.service';

@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.component.html',
  styleUrls: ['./ficha.component.scss'],
})
export class FichaComponent implements OnInit {
  isLoading: boolean = true;
  procedure: InternalProcedure | ExternalProcedure;
  workflow: workflow[] = [];
  Observations: any[] = [];
  events: eventProcedure[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private paginatorService: PaginatorService,
    private procedureService: ProcedureService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      const id = params['id'];
      this.procedureService.getFullProcedure(id).subscribe((data) => {
        this.procedure = data.procedure;
        this.workflow = data.workflow;
        this.events = data.events;
        this.isLoading = false;
      });
    });
  }

  back() {
    this.activateRoute.queryParams.subscribe((data) => {
      this.paginatorService.limit = data['limit'];
      this.paginatorService.offset = data['offset'];
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
