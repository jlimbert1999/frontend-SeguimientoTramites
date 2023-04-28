import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import Swal from 'sweetalert2';
import { ExternosService } from '../../services/externos.service';
import { InternosService } from '../../services/internos.service';
import { Location } from '@angular/common';
import { slideInLeftOnEnterAnimation } from 'angular-animations';
import { LocationProcedure } from 'src/app/Bandejas/models/workflow.interface';
import { PDF_FichaExterno } from 'src/app/Reportes/pdf/reporte-ficha';
import { Externo } from '../../models/Externo.interface';
import { Interno } from '../../models/Interno.interface';
import { createListWorkflow } from 'src/app/Bandejas/helpers/ListWorkflow';

@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.component.html',
  styleUrls: ['./ficha.component.css'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ]
})
export class FichaComponent implements OnInit {
  tipo: 'ficha-externa' | 'ficha-interna'
  Tramite: any
  Location: LocationProcedure[] = []
  Workflow: any[] = []
  constructor(
    private activateRoute: ActivatedRoute,
    private externoService: ExternosService,
    private internoService: InternosService,
    private paginatorService: PaginatorService,
    private _location: Location,
  ) {

  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.tipo = params['tipo']
      if (this.tipo == 'ficha-externa') {
        this.externoService.getOne(params['id']).subscribe(data => {
          this.Tramite = data.tramite
          this.Workflow = data.workflow
          this.Location = data.location

        })
      }
      else if (this.tipo == 'ficha-interna') {
        this.internoService.getOne(params['id']).subscribe(data => {
          this.Tramite = data.tramite
          this.Workflow = data.workflow
          this.Location = data.location
        })
      }
      else {
        console.log('no validos')
      }
    })
  }

  back() {
    this.activateRoute.queryParams.subscribe(data => {
      this.paginatorService.limit = data['limit']
      this.paginatorService.offset = data['offset']
      this.paginatorService.text = data['text'] ? data['text'] : ''
      this.paginatorService.type = data['type']
      this._location.back();
    })
  }

  generateFicha() {
    console.log(this.Workflow);
    PDF_FichaExterno(this.Tramite, createListWorkflow(this.Workflow, [{ id_root: this.Workflow[0].emisor.cuenta._id, startDate: this.Tramite.fecha_registro }], []), this.Location)
  }




}
