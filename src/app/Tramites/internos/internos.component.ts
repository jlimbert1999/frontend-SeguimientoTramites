import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { collapseOnLeaveAnimation, expandOnEnterAnimation, fadeInOnEnterAnimation } from 'angular-animations';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { DialogRemisionComponent } from '../dialog-remision/dialog-remision.component';
import { InternosService } from '../services/internos.service';
import { DialogInternosComponent } from './dialog-internos/dialog-internos.component';
import { InternoData } from './models/interno.model';
import { HojaRutaInterna } from './pdfs/hora-ruta';

@Component({
  selector: 'app-internos',
  templateUrl: './internos.component.html',
  styleUrls: ['./internos.component.css'],
  animations: [
    fadeInOnEnterAnimation(),
    expandOnEnterAnimation(),
    collapseOnLeaveAnimation(),
  ]
})
export class InternosComponent implements OnInit {
  displayedColumns: string[] = ['alterno', 'detalle', 'solicitante', 'destinatario', 'estado', 'cite', 'fecha', 'enviado', 'opciones']
  Data: InternoData[]

  filterOpions = [
    { value: 'remitente', viewValue: 'REMITENTE / CARGO' },
    { value: 'destinatario', viewValue: 'DESTINATARIO / CARGO' },
    { value: 'alterno', viewValue: 'ALTERNO' },
    { value: 'cite', viewValue: 'CITE' },
  ]


  constructor(
    public dialog: MatDialog,
    public internoService: InternosService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.internoService.searchOptions.active) {
      this.GetSearch()
    }
    else {
      this.Get()
    }
  }
  Get() {
    this.internoService.Get().subscribe(tramites => {
      this.Data = tramites
    })
  }

  GetSearch() {
    if (this.internoService.searchOptions.text !== '' && this.internoService.searchOptions.type !== '') {
      this.internoService.GetSearch().subscribe(tramites => {
        this.Data = tramites
      })
    }
  }
  Add() {
    const dialogRef = this.dialog.open(DialogInternosComponent, {
      width: '1000px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: InternoData) => {
      if (result) {
        this.showLoadingRequest()
        this.internoService.Add(result).subscribe(tramite => {
          if (this.Data.length === this.internoService.limit) {
            this.Data.pop()
          }
          this.Data = [tramite, ...this.Data]
          Swal.close();
          this.Send(tramite)
        })
      }
    });
  }
  Edit(tramite: InternoData) {
    const dialogRef = this.dialog.open(DialogInternosComponent, {
      width: '1000px',
      data: tramite
    });
    dialogRef.afterClosed().subscribe((result: InternoData) => {
      if (result) {
        this.showLoadingRequest()
        this.internoService.editInterno(tramite._id, result).subscribe(tramite => {
          const indexFound = this.Data.findIndex(element => element._id === tramite._id)
          this.Data[indexFound] = tramite
          this.Data = [...this.Data]
          Swal.close();
        })
      }
    });
  }
  Send(tramite: InternoData) {
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      width: '1200px',
      data: {
        _id: tramite._id,
        tipo: 'tramites_internos',
        tramite: {
          nombre: tramite.tipo_tramite.nombre,
          alterno: tramite.alterno,
          cantidad: tramite.cantidad
        }
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const indexFound = this.Data.findIndex(element => element._id === tramite._id)
        this.Data[indexFound].ubicacion = result.receptor
        this.Data = [...this.Data]
      }
    });
  }
  generar_hoja_ruta(id_tramite: string) {
    this.internoService.GetOne(id_tramite).subscribe(data => {
      HojaRutaInterna(data.tramite, data.workflow, 'tramites_internos')
    })
  }


  denied_options(estado: string, responsable: string) {
    if (estado !== 'INSCRITO' || responsable !== this.authService.Account.id_cuenta) {
      return true
    }
    return false
  }


  search(event: Event) {
    this.internoService.offset = 0
    this.internoService.searchOptions.text = (event.target as HTMLInputElement).value;
    this.GetSearch()
  }

  changeSearchMode(option: boolean) {
    this.internoService.offset = 0
    this.internoService.searchOptions.active = option
    if (!option) {
      this.internoService.searchOptions.text = ""
      this.internoService.searchOptions.type = ""
      this.Get()
    }
  }

  pagination(page: PageEvent) {
    this.internoService.offset = page.pageIndex
    this.internoService.limit = page.pageSize
    if (this.internoService.searchOptions.active) {
      this.GetSearch()
    }
    else {
      this.Get()
    }
  }


  showLoadingRequest() {
    Swal.fire({
      title: 'Guardando....',
      text: 'Por favor espere',
      allowOutsideClick: false,
    });
    Swal.showLoading()
  }
}
