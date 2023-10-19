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
import { createFullName } from 'src/app/helpers/fullname.helper';
import { SocketService } from 'src/app/services/socket.service';
import { ExternosService } from 'src/app/procedures/services/externos.service';
import { communication, groupedCommunication } from '../../interfaces';
import { MatSelectionList } from '@angular/material/list';

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
  typesOfShoes: string[] = [
    'Boots',
    'Clogs',
    'Loafers',
    'Moccasins',
    'Sneakers',
  ];
  dataSource: groupedCommunication[] = [];
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
  expandedElement: communication | null;
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

  View(mail: groupedCommunication) {}

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

  cancelSend(mail: groupedCommunication, selectedSendIds: string[] | null) {
    if (!selectedSendIds) return;
    Swal.fire({
      title: `Cancelar envios del tramite ${mail._id.procedure.code}?`,
      text: `Envios a cancelar: ${selectedSendIds.length}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.outboxService
          .cancelMail(mail._id.procedure._id, selectedSendIds)
          .subscribe((data) => {
            if (mail.sendings.length === selectedSendIds.length) {
              this.Get();
            } else {
              const index = this.dataSource.findIndex(
                (item) => item._id === mail._id
              );
              this.dataSource[index].sendings = mail.sendings.filter(
                (send) => !selectedSendIds.includes(send._id)
              );
            }
            Swal.fire({
              title: 'Envio cancelado',
              text: data.message,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
          });
      }
    });
  }
  selectAllItemsList(list: MatSelectionList) {
    list._items.forEach((item) => {
      if (!item.disabled) {
        item.selected = true;
      }
    });
  }
}
