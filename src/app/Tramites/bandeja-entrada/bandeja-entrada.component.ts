import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { DialogRemisionComponent } from '../dialog-remision/dialog-remision.component';
import { BandejaEntradaData } from '../models/mail.model';
import { BandejaService } from '../services/bandeja.service';
import { ExternosService } from '../services/externos.service';
import { InternosService } from '../services/internos.service';

@Component({
  selector: 'app-bandeja-entrada',
  templateUrl: './bandeja-entrada.component.html',
  styleUrls: ['./bandeja-entrada.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    fadeInOnEnterAnimation({ duration: 500 })
  ],
})
export class BandejaEntradaComponent implements OnInit {
  displayedColumns = ['alterno', 'tramite', 'descripcion', 'estado', 'receptor', 'fecha_envio', 'opciones', 'expand']
  expandedElement: any | null;

  // isLoadingResults = true;


  constructor(
    public bandejaService: BandejaService,
    public dialog: MatDialog,
    public authService: AuthService,
    private toastr: ToastrService,
    private internoService: InternosService,
    private externoService: ExternosService
  ) { }

  ngOnInit(): void {
    this.bandejaService.getmMailsIn().subscribe()
  }

  send(elemento: BandejaEntradaData) {
    if (elemento.tramite.estado === 'OBSERVADO') {
      Swal.fire('El tramite tiene observaciones pendedientes', undefined, 'info')
    }
    else {
      const dialogRef = this.dialog.open(DialogRemisionComponent, {
        width: '1200px',
        data: {
          _id: elemento.tramite._id,
          tipo: elemento.tipo,
          tramite: {
            nombre: elemento.tramite.tipo_tramite.nombre,
            alterno: elemento.tramite.alterno,
            cantidad: elemento.cantidad
          }

        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.bandejaService.getmMailsIn().subscribe()
        }
      });

    }

  }
  aceptar_tramite(elemento: BandejaEntradaData) {
    Swal.fire({
      title: `Aceptar tramite?`,
      text: `El tramite ${elemento.tramite.alterno} sera marcado como aceptado`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bandejaService.aceptar_tramite(elemento._id).subscribe(message => {
          const indexFound = this.bandejaService.DataMailsIn.findIndex(mail => mail._id === elemento._id)
          this.bandejaService.DataMailsIn[indexFound].recibido = true
          this.bandejaService.DataMailsIn[indexFound].tramite.estado = 'EN REVISION'
          this.bandejaService.DataMailsIn = [...this.bandejaService.DataMailsIn]
          this.toastr.success(undefined, message, {
            positionClass: 'toast-bottom-right',
            timeOut: 3000,
          })
        })
      }
    })
  }
  rechazar_tramite(elemento: BandejaEntradaData) {
    Swal.fire({
      icon: 'info',
      title: 'Ingrese el motivo para el rechazo del tramite',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {
          this.bandejaService.rechazar_tramite(elemento._id, result.value).subscribe(message => {
            this.toastr.info(undefined, message, {
              positionClass: 'toast-bottom-right',
              timeOut: 3000,
            })
            this.bandejaService.getmMailsIn().subscribe()
          })

        } else {
          Swal.fire({
            title: "Debe ingrese el motivo para rechazar",
            icon: 'warning'
          })
        }

      }
    })
  }
  concluir_tramite(tipo: 'tramites_internos' | 'tramites_externos', id_tramite: string) {
    Swal.fire({
      icon: 'question',
      title: 'Marcar el tramite como concluido?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (tipo === 'tramites_externos') {
          this.externoService.conclude(id_tramite).subscribe(message => {
            Swal.fire(message, undefined, 'success')
            this.bandejaService.getmMailsIn().subscribe()
          })
        }
        else if (tipo === 'tramites_internos') {
          this.internoService.conclude(id_tramite).subscribe(message => {
            Swal.fire(message, undefined, 'success')
            this.bandejaService.getmMailsIn().subscribe()
          })
        }
      }
    })

  }
  paginacion(page: PageEvent) {
    this.bandejaService.PaginationMailsIn.limit = page.pageSize
    this.bandejaService.PaginationMailsIn.offset = page.pageIndex
    this.bandejaService.getmMailsIn().subscribe()
  }



}
