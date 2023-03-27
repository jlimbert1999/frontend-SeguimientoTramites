import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import Swal from 'sweetalert2';
import { ExternosService } from '../../services/externos.service';
import { InternosService } from '../../services/internos.service';
import { Location } from '@angular/common';
import { slideInLeftOnEnterAnimation } from 'angular-animations';

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
        })
      }
      else if (this.tipo == 'ficha-interna') {
        this.internoService.GetOne(params['id']).subscribe(data => {
          this.Tramite = data.tramite
          this.Workflow = data.workflow
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
      this._location.back();
    })
  }

}
