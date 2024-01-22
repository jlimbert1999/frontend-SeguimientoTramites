import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs';

import { InboxService } from '../../services/inbox.service';

import { observation, stateProcedure } from 'src/app/procedures/interfaces';
import { INBOX_CACHE, InboxCache, statusMail } from '../../interfaces';
import { ProcedureService } from 'src/app/procedures/services/procedure.service';
import { ExternalProcedure, InternalProcedure } from 'src/app/procedures/models';
import { AlertService, PaginatorService, PdfGeneratorService } from 'src/app/shared/services';
import { Communication, Workflow } from '../../models';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailComponent implements OnInit {
  mail = signal<Communication | undefined>(undefined);
  procedure = signal<ExternalProcedure | InternalProcedure | undefined>(undefined);
  workflow: Workflow[] = [];
  observations = signal<observation[]>([]);
  constructor(
    private _location: Location,
    private alertService: AlertService,
    private inboxService: InboxService,
    private activateRoute: ActivatedRoute,
    private procedureService: ProcedureService,
    private paginatorService: PaginatorService<InboxCache>,
    private pdfService: PdfGeneratorService
  ) {}
  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      this.inboxService
        .getMailDetails(params['id'])
        .pipe(
          switchMap((mail) => {
            this.mail.set(mail);
            return this.procedureService.getFullProcedure(mail.procedure._id, mail.procedure.group);
          })
        )
        .subscribe(({ procedure, workflow, observations }) => {
          this.procedure.set(procedure);
          this.workflow = workflow;
          this.observations.set(observations);
        });
    });
  }

  backLocation() {
    this.activateRoute.queryParams.subscribe((data) => {
      this.paginatorService.limit = data['limit'] ?? 10;
      this.paginatorService.offset = data['index'] ?? 0;
      this.paginatorService.keepAliveData = true;
      this._location.back();
    });
  }

  acceptMail() {
    this.alertService.showQuestionAlert(
      `¿Aceptar tramite ${this.mail()!.procedure.code}?`,
      `El tramite sera marcado como aceptado`,
      () => {
        this.inboxService.acceptMail(this.mail()!._id).subscribe(
          (resp) => {
            this.mail()!.procedure.state = resp.state;
            this.mail()!.status = statusMail.Received;
            const index = this.cache.communications.findIndex((mail) => mail._id === this.mail()!._id);
            this.cache.communications[index].status = statusMail.Received;
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
      `¿Rechazar tramite ${this.mail()!.procedure.code}?`,
      `El tramite sera devuelto al funcionario emisor`,
      'Ingrese el motivo del rechazo',
      (description) => {
        this.inboxService.rejectMail(this.mail()!._id, description).subscribe(() => {
          this.cache.communications = this.cache.communications.filter((element) => element._id !== this.mail()?._id);
          this.cache.length--;
          this.backLocation();
        });
      }
    );
  }

  addObservation() {
    this.alertService.showConfirmAlert(
      `¿Observar el tramite: ${this.procedure()!.code}?`,
      `El tramite se mostrara como "OBSERVADO" hasta que usted marque como corregida la observacion`,
      'Ingrese la descripcion de la observacion',
      (description) => {
        this.procedureService.addObservation(this.procedure()!._id, description).subscribe((observation) => {
          this.procedure.update((values) => {
            values!.state = stateProcedure.OBSERVADO;
            return values;
          });
          this.observations.update((values) => [observation, ...values]);
          const index = this.cache.communications.findIndex((mail) => mail._id === this.mail()!._id);
          this.cache.communications[index].procedure.state = stateProcedure.OBSERVADO;
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
          this.procedure.update((values) => {
            values!.state = state;
            return values;
          });
          this.observations.update((values) => {
            const index = values.findIndex((obs) => obs._id === id_observation);
            values[index].isSolved = true;
            return values;
          });
          const index = this.cache.communications.findIndex((mail) => mail._id === this.mail()!._id);
          this.cache.communications[index].procedure.state = state;
        });
      }
    );
  }

  async generateRouteMap() {
    await this.pdfService.generateRouteSheet(this.procedure()!, this.workflow);
  }

  get external() {
    return this.procedure() as ExternalProcedure;
  }
  get internal() {
    return this.procedure() as InternalProcedure;
  }

  private get cache() {
    return this.paginatorService.cache[INBOX_CACHE];
  }
}
