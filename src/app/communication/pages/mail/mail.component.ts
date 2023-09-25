import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InboxService } from '../../services/inbox.service';
import Swal from 'sweetalert2';
import { WorkflowData } from '../../models/workflow.interface';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { showToast } from 'src/app/helpers/toats.helper';
import { SendDialogComponent } from '../../dialogs/send-dialog/send-dialog.component';

import { groupProcedure, stateProcedure } from 'src/app/procedures/interfaces';
import { communication, inbox, workflow } from '../../interfaces';
import { ProcedureService } from 'src/app/procedures/services/procedure.service';
import {
  ExternalProcedure,
  InternalProcedure,
  Procedure,
} from 'src/app/procedures/models';
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
})
export class MailComponent implements OnInit {
  group = groupProcedure;
  procedure: Procedure;
  workflow: workflow[] = [];
  mail: communication;
  observations: any[] = [];
  Events: any[] = [];
  Location: any[] = [];
  constructor(
    private _location: Location,
    private activateRoute: ActivatedRoute,
    private entradaService: InboxService,
    private paginatorService: PaginatorService,
    private procedureService: ProcedureService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      this.entradaService.getMailDetails(params['id']).subscribe((data) => {
        this.mail = data;
        this.procedureService
          .getFullProcedure(this.mail.procedure._id)
          .subscribe((data) => {
            this.procedure = data.procedure;
            this.workflow = data.workflow;
          });
      });
    });
  }

  // getFullDataProcedure(id_) {}

  back() {
    this.activateRoute.queryParams.subscribe((data) => {
      this.paginatorService.limit = data['limit'];
      this.paginatorService.offset = data['offset'];
      this.paginatorService.textSearch = data['text'] ? data['text'] : '';
      this._location.back();
    });
  }

  generar() {
    // const List =
    //   this.Workflow.length > 0
    //     ? createListWorkflow(
    //         this.Workflow,
    //         [
    //           {
    //             id_root: this.Workflow[0].emisor.cuenta._id,
    //             startDate: this.procedure.fecha_registro,
    //           },
    //         ],
    //         []
    //       )
    //     : [];
    // if (this.Mail.tipo === 'tramites_externos') {
    //   PDF_FichaExterno(this.Tramite, List, this.Location);
    // } else {
    //   PDF_FichaInterno(this.Tramite, List, this.Location);
    // }
  }

  generateRouteMap() {
    // this.Mail.tipo === 'tramites_externos'
    //   ? this.externoService.getProcedure(this.Mail.tramite).subscribe(data => {
    //     // externalRouteMap(data.procedure, data.workflow)
    //   })
    //   : this.internoService.getAllDataInternalProcedure(this.Mail.tramite).subscribe(data => {
    //     // internalRouteMap(data.procedure, data.workflow)
    //   })
  }

  aceptMail() {
    Swal.fire({
      title: `Aceptar tramite ${this.procedure.code}?`,
      text: `El tramite sera marcado como aceptado`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.entradaService.acceptMail(this.mail._id).subscribe(
          (data) => {
            // this.mail.recibido = true;
            // this.procedure.state = data.state;
            // showToast('success', data.message);
          },
          (HttpError: HttpErrorResponse) => {
            if (HttpError.status === 404) {
              this.back();
            }
          }
        );
      }
    });
  }
  rejectMail() {
    // Swal.fire({
    //   icon: 'info',
    //   title: `Rechazar tramite ${this.procedure.code}`,
    //   text: `El tramite sera devuelto a ${this.mail.emisor.fullname}`,
    //   input: 'textarea',
    //   inputPlaceholder: 'Ingrese el motivo del rechazo',
    //   showCancelButton: true,
    //   confirmButtonText: 'Aceptar',
    //   cancelButtonText: 'Cancelar',
    //   customClass: {
    //     validationMessage: 'my-validation-message',
    //   },
    //   preConfirm: (value) => {
    //     if (!value) {
    //       Swal.showValidationMessage(
    //         '<i class="fa fa-info-circle"></i> Debe ingresar el motivo para el rechazo'
    //       );
    //     }
    //   },
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.entradaService
    //       .rejectMail(this.mail._id, result.value!)
    //       .subscribe((message) => {
    //         showToast('success', message);
    //         this.back();
    //       });
    //   }
    // });
  }
  addObservation() {
    Swal.fire({
      icon: 'question',
      title: `Registrar observacion para el tramite: ${this.procedure.cite}?`,
      text: `Debe ingresar una descripcion de la observacion`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      customClass: {
        validationMessage: 'my-validation-message',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Ingrese la descripcion'
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.entradaService
          .addObservation(this.procedure._id, result.value!)
          .subscribe((observation) => {
            this.procedure.state = stateProcedure.OBSERVADO;
            this.observations.unshift(observation);
          });
      }
    });
  }
  send() {
    // const dialogRef = this.dialog.open(SendDialogComponent, {
    //   width: '1200px',
    //   data: {
    //     _id: this.procedure._id,
    //     tramite: {
    //       nombre: '',
    //       alterno: this.procedure.code,
    //       cantidad: this.mail.cantidad,
    //     },
    //   },
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.back();
    //   }
    // });
  }
  concluir() {
    Swal.fire({
      icon: 'question',
      title: `Concluir el tramite ${this.procedure.code}?`,
      text: `El tramite pasara a su seccion de archivos`,
      inputPlaceholder: 'Ingrese una referencia para concluir',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar una referencia para la conclusion'
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.entradaService
          .Conclude(this.mail._id, result.value!)
          .subscribe((message) => {
            showToast('success', message);
            this.back();
          });
      }
    });
  }

  setNewStateProcedure(state: any) {
    this.procedure.state = state;
  }

  get external() {
    return this.procedure as ExternalProcedure;
  }
  get internal() {
    return this.procedure as InternalProcedure;
  }
}
