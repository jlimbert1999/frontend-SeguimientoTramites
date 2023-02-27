import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { BandejaService } from '../services/bandeja.service';
import { ExternosService } from '../../Externos/services/externos.service';
import { Location } from '@angular/common';
import { slideInLeftOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-mail-ficha',
  templateUrl: './mail-ficha.component.html',
  styleUrls: ['./mail-ficha.component.css'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ]
})
export class MailFichaComponent implements OnInit {
  Tramite: any
  Workflow: any[] = []
  Detalles: any
  constructor(
    private activateRoute: ActivatedRoute,
    private bandejaService: BandejaService,
    private externoService: ExternosService,
    private _location: Location,
  ) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.bandejaService.getDetalisMail(params['id']).subscribe(data => {
          this.Detalles = data
          this.externoService.getOne(data.tramite).subscribe(data => {
            this.Tramite = data.tramite
            this.Workflow = data.workflow
          })
        })
      }
    })
  }

  regresar() {
    this._location.back();
  }
}
