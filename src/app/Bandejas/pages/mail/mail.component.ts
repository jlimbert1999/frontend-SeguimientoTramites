import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BandejaEntradaService } from '../../services/bandeja-entrada.service';
import { slideInLeftOnEnterAnimation } from 'angular-animations';
import Swal from 'sweetalert2';
import { WorkflowData } from '../../models/workflow.interface';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { Mail } from '../../models/entrada.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Observacion } from 'src/app/Tramites/models/Externo.interface';
import { showToast } from 'src/app/helpers/toats.helper';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ],

})
export class MailComponent implements OnInit {
  Tramite: any
  Workflow: WorkflowData[]
  Mail: Mail
  observations: Observacion[] = []
  constructor(
    private _location: Location,
    private activateRoute: ActivatedRoute,
    private entradaService: BandejaEntradaService,
    private paginatorService: PaginatorService,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.entradaService.getDetailsMail(params['id']).subscribe(data => {
          this.Mail = data.mail
          this.Tramite = data.tramite
          this.Workflow = data.workflow
          this.observations = data.observations
        })
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

  generar() {

  }



  aceptMail() {
    Swal.fire({
      title: `Aceptar tramite ${this.Tramite.alterno}?`,
      text: `El tramite sera marcado como aceptado`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.entradaService.aceptMail(this.Mail._id).subscribe(message => {
          showToast('success', message, undefined)
        })
      }
    })
  }
  rejectMail() {
    Swal.fire({
      icon: 'question',
      title: `Rechazar el tramite ${this.Tramite.alterno}?`,
      text: `Para rechazar debe ingresar un motivo`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> El motivo es obligatorio'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.entradaService.rejectMail(this.Mail._id, result.value!).subscribe(message => {
          showToast('success', message, undefined)
          this.back()
        })
      }
    })
  }
  addObservation() {
    Swal.fire({
      icon: 'question',
      title: `Registrar observacion para el tramite: ${this.Tramite.alterno}?`,
      text: `Debe ingresar una descripcion de la observacion`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Ingrese la descripcion'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.entradaService.addObservation(this.Tramite._id, result.value!).subscribe(observation => {
          this.Tramite.estado = 'OBSERVADO'
          this.observations.unshift(observation)
        })
      }
    })

  }
  setNewStateProcedure(state: string) {
    this.Tramite.estado = state
  }
}
