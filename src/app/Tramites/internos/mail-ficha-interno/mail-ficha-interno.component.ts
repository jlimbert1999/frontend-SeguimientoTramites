import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BandejaService } from '../../services/bandeja.service';
import { InternosService } from '../../services/internos.service';
import { Location } from '@angular/common';
import { slideInLeftOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-mail-ficha-interno',
  templateUrl: './mail-ficha-interno.component.html',
  styleUrls: ['./mail-ficha-interno.component.css'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ]
})
export class MailFichaInternoComponent implements OnInit {
  Detalles: any
  Tramite: any
  Workflow: any
  constructor(
    private activateRoute: ActivatedRoute,
    private internoService: InternosService,
    private bandejaService: BandejaService,
    private _location: Location) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.bandejaService.getDetalisMail(params['id']).subscribe(data => {
          this.Detalles = data
          this.internoService.getInterno(data.tramite).subscribe(data => {
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
  setNewState(state: string) {
    this.Tramite.estado = state
  }


}
