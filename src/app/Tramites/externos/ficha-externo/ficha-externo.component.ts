import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ExternosService } from '../../services/externos.service';
import { slideInLeftOnEnterAnimation } from 'angular-animations';
import { ExternoData1, WorkflowData } from '../../models/ExternoModels/Externo.interface';

@Component({
  selector: 'app-ficha-externo',
  templateUrl: './ficha-externo.component.html',
  styleUrls: ['./ficha-externo.component.css'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ]
})
export class FichaExternoComponent implements OnInit {
  Tramite: ExternoData1
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
      this.externoService.getOne(params['id']).subscribe(data => {
        this.Tramite = data.tramite
        this.Workflow = data.workflow
      })
    })
  }

  regresar() {
    this._location.back();
  }



}
