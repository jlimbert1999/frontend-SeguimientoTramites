import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { collapseOnLeaveAnimation, expandOnEnterAnimation, fadeInOnEnterAnimation } from 'angular-animations';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogRemisionComponent } from 'src/app/Bandejas/dialogs/dialog-remision/dialog-remision.component';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import Swal from 'sweetalert2';
import { DialogInternosComponent } from '../../dialogs/dialog-internos/dialog-internos.component';
import { HojaRutaInterna } from '../../pdfs/hora-ruta-interna';
import { InternosService } from '../../services/internos.service';
import { Router } from '@angular/router';
import { Interno } from '../../models/Interno.interface';
import { SocketService } from 'src/app/home/services/socket.service';
import { paramsNavigation } from '../../models/ProceduresProperties';
import { internalRouteMap } from '../../pdfs/roadMap-external';

@Component({
  selector: 'app-internos',
  templateUrl: './internos.component.html',
  styleUrls: ['./internos.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    expandOnEnterAnimation(),
    collapseOnLeaveAnimation(),
  ]
})
export class InternosComponent implements OnInit {
  displayedColumns: string[] = ['alterno', 'detalle', 'solicitante', 'destinatario', 'estado', 'cite', 'fecha', 'enviado', 'opciones']
  dataSource: Interno[] = []


  constructor(
    public dialog: MatDialog,
    public internoService: InternosService,
    private authService: AuthService,
    public paginatorService: PaginatorService,
    private router: Router,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.Get()
  }
  Get() {
    if (this.paginatorService.text !== '') {
      this.internoService.GetSearch(this.paginatorService.limit, this.paginatorService.offset, this.paginatorService.text).subscribe(data => {
        this.dataSource = data.tramites
        this.paginatorService.length = data.length
      })
    }
    else {
      this.internoService.Get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.tramites
        this.paginatorService.length = data.length
      })
    }
  }


  Add() {
    const dialogRef = this.dialog.open(DialogInternosComponent, {
      width: '1000px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: Interno) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop()
        }
        this.dataSource = [result, ...this.dataSource]
        this.paginatorService.length++
      }
    });
  }
  Edit(tramite: Interno) {
    const dialogRef = this.dialog.open(DialogInternosComponent, {
      width: '1000px',
      disableClose: true,
      data: tramite
    });
    dialogRef.afterClosed().subscribe((result: Interno) => {
      if (result) {
        const indexFound = this.dataSource.findIndex(element => element._id === tramite._id)
        this.dataSource[indexFound] = result
        this.dataSource = [...this.dataSource]
      }
    });
  }
  Send(tramite: Interno) {
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
        this.dataSource[indexFound].enviado = true
        this.dataSource = [...this.dataSource]
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginatorService.text = filterValue.toLowerCase();
    this.Get()
  }

  cancelSearch() {
    this.paginatorService.offset = 0;
    this.paginatorService.text = "";
    this.Get();
  }


  GenerateHojaRuta(id_tramite: string) {
    this.internoService.getAllDataInternalProcedure(id_tramite).subscribe(data => {
      // HojaRutaInterna(data.procedure, data.workflow, this.authService.account.id_account)
      internalRouteMap(data.procedure, data.workflow)

    })
  }

  conclude(procedure: Interno) {
    Swal.fire({
      icon: 'question',
      title: `Concluir el tramite ${procedure.alterno}?`,
      text: `El tramite pasara a su seccion de archivos`,
      inputPlaceholder: 'Ingrese una referencia para concluir',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar una referencia para concluir'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.internoService.conclude(procedure._id, result.value!).subscribe(message => {
          this.socketService.socket.emit('archive', this.authService.account.id_dependencie)
          Swal.fire(message, undefined, 'success')
          const index = this.dataSource.findIndex(element => element._id === procedure._id)
          this.dataSource[index].estado = 'CONCLUIDO'
          this.dataSource = [...this.dataSource]
        })
      }
    })
  }
  view(procedure: Interno) {
    let params: paramsNavigation = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset
    }
    if (this.paginatorService.text !== '') params.text = this.paginatorService.text
    this.router.navigate(['home/tramites/internos/ficha-interna', procedure._id], { queryParams: params })
  }

}
