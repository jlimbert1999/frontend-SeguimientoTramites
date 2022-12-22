import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { slideInLeftOnEnterAnimation } from 'angular-animations';
import { ActivatedRoute } from '@angular/router';
import { InternosService } from '../../services/internos.service';

@Component({
  selector: 'app-ficha-interno',
  templateUrl: './ficha-interno.component.html',
  styleUrls: ['./ficha-interno.component.css'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ]
})
export class FichaInternoComponent implements OnInit {
  Tramite: any
  Workflow: any
  constructor(
    private _location: Location,
    private activateRoute: ActivatedRoute,
    private internoService: InternosService) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.internoService.getInterno(params['id']).subscribe(data => {
          this.Tramite = data.tramite
          this.Workflow = data.workflow
        })
       
      }
    })
  }
  regresar() {
    this._location.back();
  }


}
