import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

import { fadeInOnEnterAnimation } from 'angular-animations';
import { ExternosService } from '../../../Tramites/services/externos.service';

import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { BandejaSalidaService } from '../../services/bandeja-salida.service';
import { InternosService } from 'src/app/Tramites/services/internos.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { Router } from '@angular/router';
import { GroupedMails, Salida } from '../../models/salida.interface';
import { SocketService } from 'src/app/home/services/socket.service';


@Component({
  selector: 'app-bandeja-salida',
  templateUrl: './bandeja-salida.component.html',
  styleUrls: ['./bandeja-salida.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    fadeInOnEnterAnimation()
  ],
})
export class BandejaSalidaComponent implements OnInit, AfterViewInit {
  dataSource: GroupedMails[] = []
  displayedColumns = ['group', 'alterno', 'descripcion', 'estado', 'fecha_envio', 'situacion', 'opciones', 'expand']
  isLoadingResults = true;
  expandedElement: Salida | null;
  resulstLenght: number = 0

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private externoService: ExternosService,
    private internoService: InternosService,
    private bandejaService: BandejaSalidaService,
    public paginatorService: PaginatorService,
    private router: Router,
    private socketService: SocketService
  ) { }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.Get()

  }
  Get() {
    if (this.paginatorService.type) {
      this.bandejaService.Search(this.paginatorService.limit, this.paginatorService.offset, this.paginatorService.type, this.paginatorService.text).subscribe(data => {
        this.dataSource = data.mails
        this.paginatorService.length = data.length
      })
    }
    else {
      this.bandejaService.get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.mails
        this.paginatorService.length = data.length
      })
    }
  }

  generar_hoja_ruta(id_tramite: string, tipo_hoja: 'tramites_externos' | 'tramites_internos') {
    // if (tipo_hoja === 'tramites_externos') {
    //   this.externoService.getOne(id_tramite).subscribe(data => {
    //     // crear_hoja_ruta(data.tramite, data.workflow, tipo_hoja)
    //   })
    // }
    // else {
    //   this.internoService.getOne(id_tramite).subscribe(data => {
    //     // HojaRutaInterna(data.tramite, data.workflow, tipo_hoja)
    //   })
    // }
  }

  cancelOneSend(imbox: Salida) {
    Swal.fire({
      title: `Cancelar el envio del tramite?`,
      text: `El funcionario ${imbox.receptor.funcionario.nombre} ${imbox.receptor.funcionario.paterno} ${imbox.receptor.funcionario.materno} ya no podra ver el tramite.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bandejaService.cancelOneSend(imbox._id).subscribe(message => {
          const index = this.dataSource.findIndex(mail => mail.cuenta === imbox.emisor.cuenta && mail.tramite._id === imbox.tramite._id && mail.fecha_envio === imbox.fecha_envio)
          const sendings = this.dataSource[index].sendings.filter((item: any) => item._id !== imbox._id)
          if (sendings.length === 0) {
            this.Get()
          }
          else {
            this.dataSource[index].sendings = sendings
          }
          this.socketService.socket.emit('mail-one-cancel', imbox.receptor.cuenta)
          Swal.fire({
            icon: 'success',
            title: 'Envio cancelado!',
            text: message,
            confirmButtonText: 'Aceptar'
          })
        })
      }
    })
  }
  cancelAllSend(data: GroupedMails) {
    Swal.fire({
      title: `Cancelar todos los envios del tramite?`,
      text: `Se cancelaran ${data.sendings.length} envios`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bandejaService.cancelAllSend(data.tramite._id, data.fecha_envio).subscribe(message => {
          Swal.fire({
            icon: 'success',
            title: 'Todos los envios han sidos cancelados!',
            text: message,
            confirmButtonText: 'Aceptar'
          })
          this.Get()
        })

      }
    })
  }


  View(mail: GroupedMails) {
    let params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset
    }
    if (this.paginatorService.text !== '') {
      Object.assign(params, { type: this.paginatorService.type })
      Object.assign(params, { text: this.paginatorService.text })
    }
    if (mail.tipo === 'tramites_externos') {
      this.router.navigate(['home/bandejas/salida/mail/ficha-externa', mail.tramite._id], { queryParams: params })
    }
    else {
      this.router.navigate(['home/bandejas/salida/mail/ficha-interna', mail.tramite._id], { queryParams: params })
    }

  }


  applyFilter(event: Event) {
    if (this.paginatorService.type) {
      this.paginatorService.offset = 0
      const filterValue = (event.target as HTMLInputElement).value;
      this.paginatorService.text = filterValue.toLowerCase();
      this.Get()
    }
  }

  selectTypeSearch() {
    if (this.paginatorService.type === undefined) {
      this.paginatorService.text = ''
    }
    this.paginatorService.offset = 0
    this.Get()
  }

  cancelSearch() {
    this.paginatorService.offset = 0;
    this.paginatorService.text = "";
    this.paginatorService.type = undefined
    this.Get();
  }




}




