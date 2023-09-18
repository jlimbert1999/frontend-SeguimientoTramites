import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

import { fadeInOnEnterAnimation } from 'angular-animations';

import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { OutboxService } from '../../services/outbox.service';
import { InternosService } from 'src/app/procedures/services/internos.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { Router } from '@angular/router';
import { GroupedMails, Salida } from '../../models/salida.interface';
import { createFullName } from 'src/app/helpers/fullname.helper';
import { SocketService } from 'src/app/services/socket.service';
import { ExternosService } from 'src/app/procedures/services/externos.service';
import { groupedOutbox } from '../../interfaces';

@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    fadeInOnEnterAnimation(),
  ],
})
export class OutboxComponent implements OnInit, AfterViewInit {
  dataSource: groupedOutbox[] = [];
  displayedColumns = [
    'alterno',
    'descripcion',
    'estado',
    'fecha_envio',
    'situacion',
    'opciones',
    'expand',
  ];
  isLoadingResults = true;
  expandedElement: Salida | null;
  resulstLenght: number = 0;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private externoService: ExternosService,
    private internoService: InternosService,
    private outboxService: OutboxService,
    public paginatorService: PaginatorService,
    private router: Router,
    private socketService: SocketService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.Get();
  }
  Get() {
    if (this.paginatorService.textSearch) {
      this.outboxService
        .Search(
          this.paginatorService.limit,
          this.paginatorService.offset,
          this.paginatorService.textSearch
        )
        .subscribe((data) => {
          this.dataSource = data.mails;
          this.paginatorService.length = data.length;
        });
    } else {
      this.outboxService
        .getOutboxOfAccount(
          this.paginatorService.limit,
          this.paginatorService.offset
        )
        .subscribe((data) => {
          this.dataSource = data.mails;
          this.paginatorService.length = data.length;
        });
    }
  }

  generar_hoja_ruta(
    id_tramite: string,
    tipo_hoja: 'tramites_externos' | 'tramites_internos'
  ) {
    if (tipo_hoja === 'tramites_externos') {
      // this.externoService.getProcedure(id_tramite).subscribe((data) => {
      // externalRouteMap(data.procedure, data.workflow)
      // HojaRutaExterna(data.procedure, data.workflow, this.authService.account.id_account)
      // });
    } else {
      // this.internoService
      //   .getAllDataInternalProcedure(id_tramite)
      //   .subscribe((data) => {
      //     // HojaRutaInterna(data.procedure, data.workflow, this.authService.account.id_account)
      //     // internalRouteMap(data.procedure, data.workflow)
      //   });
    }
  }

  cancelOneSend(imbox: Salida) {
    Swal.fire({
      title: `Cancelar el envio del tramite?`,
      text: `El funcionario ${createFullName(
        imbox.receptor.funcionario!
      )} ya no podra ver el tramite.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.outboxService.cancelOneSend(imbox._id).subscribe((message) => {
          this.socketService.emitCancelMail(imbox.receptor.cuenta);
          const index = this.dataSource.findIndex(
            (mail) =>
              mail._id.account === imbox.emisor.cuenta &&
              mail._id.procedure._id === imbox.tramite._id &&
              mail._id.outboundDate === imbox.fecha_envio
          );
          const sendings = this.dataSource[index].sendings.filter(
            (item) => item._id !== imbox._id
          );
          if (sendings.length === 0) {
            this.Get();
            Swal.fire({
              icon: 'success',
              title: 'Todos los envios se cancelaron',
              text: message,
              confirmButtonText: 'Aceptar',
            });
          } else {
            this.dataSource[index].sendings = sendings;
          }
        });
      }
    });
  }
  cancelAllSend(data: GroupedMails) {
    Swal.fire({
      title: `Cancelar envio del tramite ${data.tramite.alterno}?`,
      text: `Se cancelaran ${data.sendings.length} envios`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.outboxService
          .cancelAllSend(data.tramite._id, data.fecha_envio)
          .subscribe((message) => {
            Swal.fire({
              icon: 'success',
              title: 'Todos los envios se cancelaron',
              text: message,
              confirmButtonText: 'Aceptar',
            });
            this.socketService.emitCancelAllMails(
              data.sendings.map((imbox) => imbox.receptor.cuenta)
            );
            this.Get();
          });
      }
    });
  }

  View(mail: GroupedMails) {
    let params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
    };
    if (this.paginatorService.textSearch !== '') {
      // Object.assign(params, { type: this.paginatorService.type });
      Object.assign(params, { text: this.paginatorService.textSearch });
    }
    if (mail.tipo === 'tramites_externos') {
      this.router.navigate(
        ['home/bandejas/salida/mail/ficha-externa', mail.tramite._id],
        { queryParams: params }
      );
    } else {
      this.router.navigate(
        ['home/bandejas/salida/mail/ficha-interna', mail.tramite._id],
        { queryParams: params }
      );
    }
  }

  applyFilter(event: Event) {
    if (this.paginatorService.textSearch) {
      this.paginatorService.offset = 0;
      const filterValue = (event.target as HTMLInputElement).value;
      this.paginatorService.textSearch = filterValue.toLowerCase();
      this.Get();
    }
  }

  cancelSearch() {
    this.paginatorService.offset = 0;
    this.paginatorService.textSearch = '';
    this.Get();
  }
}
