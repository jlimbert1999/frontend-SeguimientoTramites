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
import { DialogRemisionComponent } from '../../dialogs/dialog-remision/dialog-remision.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { createFullName } from 'src/app/helpers/fullname.helper';
import { createListWorkflow } from '../../helpers/ListWorkflow';
import { PDF_FichaExterno, PDF_FichaInterno } from 'src/app/Reportes/pdf/reporte-ficha-externa';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ],

})
export class MailComponent implements OnInit {
  Tramite: any
  Workflow: WorkflowData[]
  Mail: Mail
  observations: Observacion[] = []
  Events: any[] = []
  Location: any[] = []
  constructor(
    private _location: Location,
    private activateRoute: ActivatedRoute,
    private entradaService: BandejaEntradaService,
    private paginatorService: PaginatorService,
    private authService: AuthService,
    public dialog: MatDialog,
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
          this.Events = data.events
          this.Location = data.location
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
    const List = this.Workflow.length > 0
      ? createListWorkflow(this.Workflow, [{ id_root: this.Workflow[0].emisor.cuenta._id, startDate: this.Tramite.fecha_registro }], [])
      : []
    if (this.Mail.tipo === 'tramites_externos') {
      PDF_FichaExterno(this.Tramite, List, this.Location)
    }
    else {
      PDF_FichaInterno(this.Tramite, List, this.Location)
    }
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
        this.entradaService.aceptMail(this.Mail._id).subscribe(data => {
          this.Mail.recibido = true
          this.Tramite.estado = data.state
          showToast('success', data.message)
        }, (HttpError: HttpErrorResponse) => {
          if (HttpError.status === 404) {
            this.back()
          }
        })
      }
    })
  }
  rejectMail() {
    Swal.fire({
      icon: 'info',
      title: `Rechazar tramite ${this.Tramite.alterno}`,
      text: `El tramite sera devuelto a ${createFullName(this.Mail.emisor.funcionario)}`,
      input: 'textarea',
      inputPlaceholder: 'Ingrese el motivo del rechazo',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar el motivo para el rechazo'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.entradaService.rejectMail(this.Mail._id, result.value!).subscribe(message => {
          showToast('success', message)
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
  send() {
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      width: '1200px',
      data: {
        _id: this.Tramite._id,
        tipo: this.Mail.tipo,
        tramite: {
          nombre: '',
          alterno: this.Tramite.alterno,
          cantidad: this.Mail.cantidad
        }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.back()
      }
    });
  }
  concluir() {
    Swal.fire({
      icon: 'question',
      title: `Concluir el tramite ${this.Tramite.alterno}?`,
      text: `El tramite pasara a su seccion de archivos`,
      inputPlaceholder: 'Ingrese una referencia para concluir',
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
            '<i class="fa fa-info-circle"></i> Debe ingresar una referencia para la conclusion'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.entradaService.Conclude(this.Mail._id, result.value!).subscribe(message => {
          showToast('success', message)
          this.back()
        })
      }
    })
  }

  setNewStateProcedure(state: string) {
    this.Tramite.estado = state
  }


}
