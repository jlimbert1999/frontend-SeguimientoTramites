import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InboxService } from '../../services/inbox.service';
import Swal from 'sweetalert2';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { showToast } from 'src/app/helpers/toats.helper';

import {
  groupProcedure,
  observation,
  stateProcedure,
} from 'src/app/procedures/interfaces';
import { communication, statusMail, workflow } from '../../interfaces';
import { ProcedureService } from 'src/app/procedures/services/procedure.service';
import {
  ExternalProcedure,
  InternalProcedure,
} from 'src/app/procedures/models';
import { createExternalRouteMap } from 'src/app/procedures/helpers/external-route-map';
import { CreateInternalProcedureDto } from 'src/app/procedures/dtos/create-internal.dto';
import { createInternalRouteMap } from 'src/app/procedures/helpers/internal-route-map';
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
})
export class MailComponent implements OnInit {
  mail: communication;
  procedure: InternalProcedure | ExternalProcedure;
  workflow: workflow[] = [];
  observations: observation[] = [];
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

        this.getFullDetailsProcedure(this.mail.procedure._id);
      });
    });
  }

  getFullDetailsProcedure(id_procedure: string) {
    this.procedureService.getFullProcedure(id_procedure).subscribe((data) => {
      this.procedure = data.procedure;
      this.workflow = data.workflow;
      this.observations = data.observations;
    });
  }

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

  acceptMail() {
    Swal.fire({
      title: `¿Aceptar tramite ${this.mail.procedure.code}?`,
      text: `El tramite sera marcado como aceptado`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.entradaService.acceptMail(this.mail._id).subscribe(
          (newState) => {
            this.mail.status = statusMail.Received;
            this.procedure.state = newState;
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
    Swal.fire({
      icon: 'question',
      title: `¿Rechazar tramite ${this.mail.procedure.code}?`,
      text: `El tramite sera devuelto al funcionario ${this.mail.emitter.fullname}`,
      input: 'textarea',
      inputPlaceholder: 'Ingrese el motivo del rechazo',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar el motivo para el rechazo'
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.back();
      }
    });
  }
  addObservation() {
    Swal.fire({
      icon: 'question',
      title: `¿Observar el tramite: ${this.procedure.code}?`,
      text: `El estado pasara a ser observado hasta su correccion`,
      input: 'textarea',
      inputPlaceholder: 'Ingrese la descripcion de la observacion',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
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
            console.log(observation);
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

  generateRouteMap() {
    switch (this.procedure.group) {
      case groupProcedure.EXTERNAL:
        createExternalRouteMap(this.external, this.workflow);
        break;
      case groupProcedure.INTERNAL:
        createInternalRouteMap(this.internal, this.workflow);
        break;
      default:
        alert('Group procedure is not defined');
        break;
    }
  }

  get external() {
    return this.procedure as ExternalProcedure;
  }
  get internal() {
    return this.procedure as InternalProcedure;
  }
  get group() {
    return groupProcedure;
  }
}
