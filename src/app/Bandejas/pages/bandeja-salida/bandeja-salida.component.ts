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
import { Salida, GroupedMails } from '../../models/salida.interface';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bandeja-salida',
  templateUrl: './bandeja-salida.component.html',
  styleUrls: ['./bandeja-salida.component.css'],
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
    private router: Router
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
      this.bandejaService.Get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.mails
        this.paginatorService.length = data.length
      })
    }
  }

  generar_hoja_ruta(id_tramite: string, tipo_hoja: 'tramites_externos' | 'tramites_internos') {
    if (tipo_hoja === 'tramites_externos') {
      this.externoService.getOne(id_tramite).subscribe(data => {
        // crear_hoja_ruta(data.tramite, data.workflow, tipo_hoja)
      })
    }
    else {
      this.internoService.getOne(id_tramite).subscribe(data => {
        // HojaRutaInterna(data.tramite, data.workflow, tipo_hoja)
      })
    }
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
          Swal.fire({
            icon: 'success',
            title: 'Envio cancelado!',
            text: message
          })
          // Swal.fire({ title: 'Envio cancelado!', icon: 'success', text: message })
          // const index = this.dataSource.findIndex(data => data._id.tramite._id === imbox.tramite)
          // this.dataSource[index].
          // this.dataSource = this.dataSource.filter(element => element._id !== mail._id)
          // this.dataSource = [...this.dataSource]
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
        this.bandejaService.cancelAllSend(data._id.tramite._id, data._id.fecha_envio).subscribe(message => {
          Swal.fire({
            icon: 'success',
            title: 'Envio cancelado!',
            text: message
          })
        })
        this.Get()
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
    if (mail._id.tipo === 'tramites_externos') {
      this.router.navigate(['home/bandejas/salida/mail/ficha-externa', mail._id.tramite._id], { queryParams: params })
    }
    else {
      this.router.navigate(['home/bandejas/salida/mail/ficha-interna', mail._id.tramite._id], { queryParams: params })
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




