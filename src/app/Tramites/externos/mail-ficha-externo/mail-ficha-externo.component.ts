import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BandejaService } from '../../services/bandeja.service';
import { ExternosService } from '../../services/externos.service';
import { Location } from '@angular/common';
import { MailDetails } from '../../models/mail.model';
import { slideInLeftOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-mail-ficha-externo',
  templateUrl: './mail-ficha-externo.component.html',
  styleUrls: ['./mail-ficha-externo.component.css'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ]
})
export class MailFichaExternoComponent implements OnInit {
  Tramite: any
  Workflow: any[] = []
  Detalles: MailDetails
  constructor(
    private activateRoute: ActivatedRoute,
    private bandejaService: BandejaService,
    private externoService: ExternosService,
    private _location: Location,
  ) {
    
    
   }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.bandejaService.getDetalisMail(params['id']).subscribe(data => {
          this.Detalles = data
          this.externoService.getExterno(data.tramite).subscribe(data => {
            this.Tramite = data.tramite
            console.log(this.Tramite)
            this.Workflow = data.workflow
          })
        })
      }
    })
  }
  setNewState(state: string) {
    this.Tramite.estado = state
  }
  regresar() {
    this._location.back();
  }

}
