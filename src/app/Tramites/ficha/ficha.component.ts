import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TramiteService } from '../services/tramite.service';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { slideInLeftOnEnterAnimation } from 'angular-animations';
import { ExternosService } from '../../Externos/services/externos.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatAccordion } from '@angular/material/expansion';


@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.component.html',
  styleUrls: ['./ficha.component.css'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ]
})
export class FichaComponent implements OnInit {
  id_tramite: string
  Tramite: any
  Solicitante: any
  Representante: any
  nodos: any[] = []
  links: any[] = []
  clusters: { id: string, label: string, childNodeIds: string[] }[] = []
  Workflow: any[] = []
  panelOpenState = false;

  Mis_Observaciones: any
  Otras_Observaciones: any[] = []
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private _location: Location,
    private authService: AuthService,
    private externoService: ExternosService,
    private activateRoute: ActivatedRoute
  ) {
  }

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

  regresar() {
    this._location.back();
  }





}
