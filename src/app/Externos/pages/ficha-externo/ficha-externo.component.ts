import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { slideInLeftOnEnterAnimation } from 'angular-animations';
import { Externo, WorkflowData } from '../../models/Externo.interface';
import { ExternosService } from '../../services/externos.service';
import { PDF_FichaExterno } from 'src/app/Reportes/pdf/reporte-ficha';

@Component({
  selector: 'app-ficha-externo',
  templateUrl: './ficha-externo.component.html',
  styleUrls: ['./ficha-externo.component.css'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ]
})
export class FichaExternoComponent implements OnInit {
  Tramite: Externo
  Workflow: WorkflowData[] = []
  timer: any;
  count: any
  constructor(
    private _location: Location,
    private activateRoute: ActivatedRoute,
    private externoService: ExternosService
  ) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.externoService.getOne(params['id']).subscribe(data => {
          this.Tramite = data.tramite
          this.Workflow = data.workflow
        })
      }
    })
  }
  generar() {
    PDF_FichaExterno(this.Tramite, this.Workflow, 'Jose')
  }

  regresar() {
    this._location.back();
  }



}
