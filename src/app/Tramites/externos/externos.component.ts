import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { TramiteService } from '../services/tramite.service';
import { DialogExternoComponent } from './dialog-externo/dialog-externo.component';
import { crear_ficha_tramite, crear_hoja_ruta } from 'src/app/Tramites/pdf/tramites';
import { DialogRemisionComponent } from '../dialog-remision/dialog-remision.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ExternosService } from '../services/externos.service';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Externo, ExternoData, Representante, Solicitante } from './models/externo';
import Swal from 'sweetalert2';
import { LocationComponent } from 'src/app/shared/location/location.component';
import { provideRouter, Router } from '@angular/router';
import { FichaExternoComponent } from './ficha-externo/ficha-externo.component';
import { Ficha } from './pdf/ficha';
import { HojaRuta } from './pdf/hoja-ruta';
import { EnvioModel } from '../models/mail.model';
import { BandejaService } from '../services/bandeja.service';

@Component({
  selector: 'app-externos',
  templateUrl: './externos.component.html',
  styleUrls: ['./externos.component.css'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500 })
  ]

})
export class ExternosComponent implements OnInit, OnDestroy, AfterViewInit {

  data: ExternoData[] = []
  displayedColumns: string[] = ['alterno', 'tramite', 'descripcion', 'estado', 'solicitante', 'fecha_registro', 'enviado','opciones'];
  dataSource: ExternoData[] = [];
  resultsLength = 0;
  filterOpions = [
    'ALTERNO',
    'SOLICITANTE',
    'TIPO DE TRAMITE'
  ]
  selectedTypeFilter: string
  showFilter: boolean = false
  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public externoService: ExternosService,
    private _bottomSheet: MatBottomSheet,
    private bandejaService: BandejaService
  ) { }
  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.GetData()
  }

  GetData() {
    this.externoService.Get().subscribe(tramites => {
      this.data = tramites
    })
  }


  Add() {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: { tramite: Externo, solicitante: Solicitante, representante: Representante | null }) => {
      if (result) {
        this.showLoadingRequest()
        this.externoService.Add(result.tramite, result.solicitante, result.representante).subscribe(tramite => {
          if (this.data.length === this.externoService.limit) {
            this.data.pop()
          }
          this.data = [tramite, ...this.data]
          Swal.close();
          this.Send(tramite)
        })
      }
    });
  }
  Edit(tramite: ExternoData) {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      data: tramite,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: { tramite: any, solicitante: Solicitante, representante: Representante }) => {
      if (result) {
        this.showLoadingRequest()
        this.externoService.Edit(tramite._id, result.tramite, result.solicitante, result.representante).subscribe(tramite => {
          const indexFound = this.data.findIndex(element => element._id === tramite._id)
          this.data[indexFound] = tramite
          this.data = [...this.data]
          Swal.close();
        })
      }
    });
  }


  Send(tramite: ExternoData) {
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      width: '1200px',
      data: {
        _id: tramite._id,
        tipo: 'tramites_externos',
        tramite: {
          nombre: tramite.tipo_tramite.nombre,
          alterno: tramite.alterno,
          cantidad: tramite.cantidad
        }
      }
    });
    dialogRef.afterClosed().subscribe((result: EnvioModel) => {
      if (result) {

        this.GetData()
      }
    });
  }
  paginacion(page: PageEvent) {
    this.externoService.offset = page.pageIndex
    this.externoService.limit = page.pageSize
    this.GetData()


  }

  denied_options(estado: string, responsable: string) {
    if (estado !== 'INSCRITO' || responsable !== this.authService.Account.id_cuenta) {
      return true
    }
    return false
  }

  showLoadingRequest() {
    Swal.fire({
      title: 'Guardando....',
      text: 'Por favor espere',
      allowOutsideClick: false,
    });
    Swal.showLoading()
  }


  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== '') {
      this.externoService.filter(filterValue, this.selectedTypeFilter).subscribe(data => {
        this.data = data.tramites
        this.resultsLength = data.total
      })
    }
  }



  filterMode(option: boolean) {
    this.showFilter = option
    this.externoService.resetPagination()
    if (option) {

    }
    else {
      this.GetData()
    }
  }


  GenerateHojaRuta(id_tramite: string) {
    this.externoService.getExterno(id_tramite).subscribe(data => {
      HojaRuta(data.tramite, data.workflow)
    })
  }
  GenerateFicha(tramite: ExternoData) {
    Ficha(tramite)
  }

}

