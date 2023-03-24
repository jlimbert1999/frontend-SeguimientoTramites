import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { collapseOnLeaveAnimation, expandOnEnterAnimation, fadeInOnEnterAnimation } from 'angular-animations';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogRemisionComponent } from 'src/app/Bandejas/dialogs/dialog-remision/dialog-remision.component';
import Swal from 'sweetalert2';
import { DialogInternosComponent } from '../../dialogs/dialog-internos/dialog-internos.component';
import { HojaRutaInterna } from '../../pdfs/hora-ruta-interna';
import { InternosService } from '../../services/internos.service';

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
  displayedColumns: string[] = ['alterno', 'detalle', 'solicitante', 'destinatario', 'estado', 'cite', 'fecha', 'opciones']
  dataSource: any[]
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    this.Get()
  }
  Get() {
    if (this.internoService.textSearch !== '') {
      this.internoService.GetSearch().subscribe(tramites => {
        this.dataSource = tramites
      })
    }
    else {
      this.internoService.Get().subscribe(tramites => {
        this.dataSource = tramites
      })
    }
  }


  Add() {
    const dialogRef = this.dialog.open(DialogInternosComponent, {
      width: '1000px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.showLoadingRequest()
        this.internoService.Add(result).subscribe(tramite => {
          if (this.dataSource.length === this.internoService.limit) {
            this.dataSource.pop()
          }
          this.dataSource = [tramite, ...this.dataSource]
          Swal.close();
          this.Send(tramite)
        })
      }
    });
  }
  Edit(tramite: any) {
    const dialogRef = this.dialog.open(DialogInternosComponent, {
      width: '1000px',
      data: tramite
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.showLoadingRequest()
        this.internoService.Edit(tramite._id, result).subscribe(tramite => {
          const indexFound = this.dataSource.findIndex(element => element._id === tramite._id)
          this.dataSource[indexFound] = tramite
          this.dataSource = [...this.dataSource]
          Swal.close();
        })
      }
    });
  }
  Send(tramite: any) {
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
        const indexFound = this.dataSource.findIndex(element => element._id === tramite._id)
        this.dataSource[indexFound].estado = 'EN REVISION'
        this.dataSource = [...this.dataSource]
      }
    });
  }

  pagination(page: PageEvent) {
    this.internoService.offset = page.pageIndex
    this.internoService.limit = page.pageSize
    this.Get()
  }

  applyFilter(event: Event) {
    this.paginator.firstPage();
    const filterValue = (event.target as HTMLInputElement).value;
    this.internoService.textSearch = filterValue.toLowerCase();
    this.Get()
  }

  cancelSearch() {
    this.paginator.firstPage();
    this.internoService.textSearch = "";
    this.Get();
  }

  showLoadingRequest() {
    Swal.fire({
      title: 'Guardando....',
      text: 'Por favor espere',
      allowOutsideClick: false,
    });
    Swal.showLoading()
  }

  GenerateHojaRuta(id_tramite: string) {
    this.internoService.GetOne(id_tramite).subscribe(data => {
      HojaRutaInterna(data.tramite, data.workflow, this.authService.Account.id_cuenta)
    })
  }
}
