import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { InboxService } from '../../services/inbox.service';
import Swal from 'sweetalert2';
import { PaginatorService } from 'src/app/shared/services/paginator.service';

import { groupProcedure, observation, stateProcedure } from 'src/app/procedures/interfaces';
import { communicationResponse, statusMail, workflowResponse } from '../../interfaces';
import { ProcedureService } from 'src/app/procedures/services/procedure.service';
import { ExternalProcedure, InternalProcedure } from 'src/app/procedures/models';
import { createRouteMap } from 'src/app/procedures/helpers';
import { AlertService } from 'src/app/shared/services';
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
})
export class MailComponent implements OnInit {
  mail: communicationResponse;
  procedure: InternalProcedure | ExternalProcedure;
  workflow: workflowResponse[] = [];
  observations: observation[] = [];
  constructor(
    private _location: Location,
    private activateRoute: ActivatedRoute,
    private inboxService: InboxService,
    private paginatorService: PaginatorService,
    private procedureService: ProcedureService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      this.inboxService.getMailDetails(params['id']).subscribe((data) => {
        this.mail = data;
        this.getFullDetailsProcedure(this.mail.procedure._id, this.mail.procedure.group);
      });
    });
  }

  getFullDetailsProcedure(id_procedure: string, group: groupProcedure) {
    this.procedureService.getFullProcedure(id_procedure, group).subscribe((data) => {
      this.procedure = data.procedure;
      // this.workflow = data.workflow;
      this.observations = data.observations;
    });
  }

  backLocation() {
    this.activateRoute.queryParams.subscribe((data) => {
      // this.paginatorService.limit = data['limit'];
      this.paginatorService.offset = data['offset'];
      const searchMode = String(data['search']).toLowerCase();
      this.paginatorService.searchMode = searchMode === 'true' ? true : false;
      this._location.back();
    });
  }

  acceptMail() {
    this.alertService.showQuestionAlert(
      `¿Aceptar tramite ${this.mail.procedure.code}?`,
      `El tramite sera marcado como aceptado`,
      () => {
        this.inboxService.acceptMail(this.mail._id).subscribe(
          (resp) => {
            this.mail.procedure.state = resp.state;
            this.mail.status = statusMail.Received;
            this.alertService.showSuccesToast({ title: 'Aceptado' });
          },
          () => {
            this._location.back();
          }
        );
      }
    );
  }
  rejectMail() {
    this.alertService.showConfirmAlert(
      `¿Rechazar tramite ${this.mail.procedure.code}?`,
      `El tramite sera devuelto al funcionario emisor`,
      'Ingrese el motivo del rechazo',
      (description) => {
        this.inboxService.rejectMail(this.mail._id, description).subscribe((message) => {
          this.alertService.showSuccesToast({ title: 'Rechazado' });

          this.backLocation();
        });
      }
    );
  }
  addObservation() {
    this.alertService.showConfirmAlert(
      `¿Observar el tramite: ${this.procedure.code}?`,
      `El tramite se mostrara como "OBSERVADO" hasta que usted marque como corregida la observacion`,
      'Ingrese la descripcion de la observacion',
      (description) => {
        this.procedureService.addObservation(this.procedure._id, description).subscribe((observation) => {
          this.procedure.state = stateProcedure.OBSERVADO;
          this.observations = [observation, ...this.observations];
        });
      }
    );
  }
  solvedObservation(id_observation: string) {
    this.alertService.showQuestionAlert(
      '¿Marcar la observacion como corregida?',
      'Si todas las observaciones son corregidas el tramite dejara de estar "OBSERVADO"',
      () => {
        this.procedureService.repairObservation(id_observation).subscribe((state) => {
          this.procedure.state = state;
          const index = this.observations.findIndex((obs) => obs._id === id_observation);
          this.observations[index].isSolved = true;
        });
      }
    );
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
        this.inboxService.Conclude(this.mail._id, result.value!).subscribe((message) => {
          this.backLocation();
        });
      }
    });
  }
  generateRouteMap() {
    createRouteMap(this.procedure, this.workflow);
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
