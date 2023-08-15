import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { collapseOnLeaveAnimation, expandOnEnterAnimation, fadeInOnEnterAnimation } from 'angular-animations';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import Swal from 'sweetalert2';
import { DialogInternosComponent } from '../../dialogs/dialog-internos/dialog-internos.component';
import { InternosService } from '../../services/internos.service';
import { Router } from '@angular/router';
import { paramsNavigation } from '../../models/ProceduresProperties';
import { SocketService } from 'src/app/services/socket.service';
import { internal } from '../../interfaces/internal.interface';
import { createInternalRouteMap } from '../../helpers/internal-route-map';
import { SendDialogComponent } from 'src/app/communication/dialogs/send-dialog/send-dialog.component';
import { sendDetail } from 'src/app/communication/interfaces';

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
  displayedColumns: string[] = ['alterno', 'detalle', 'destinatario', 'estado', 'fecha', 'enviado', 'opciones']
  dataSource: internal[] = []


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
      this.internoService.search(this.paginatorService.limit, this.paginatorService.offset, this.paginatorService.text).subscribe(data => {
        this.dataSource = data.procedures
        this.paginatorService.length = data.length
      })
    }
    else {
      this.internoService.Get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.procedures
        this.paginatorService.length = data.length
      })
    }
  }


  Add() {
    const dialogRef = this.dialog.open(DialogInternosComponent, {
      width: '1000px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: internal) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop()
        }
        this.dataSource = [result, ...this.dataSource]
        this.paginatorService.length++;
      }
    });
  }
  Edit(tramite: internal) {
    const dialogRef = this.dialog.open(DialogInternosComponent, {
      width: '1000px',
      disableClose: true,
      data: tramite
    });
    dialogRef.afterClosed().subscribe((result: internal) => {
      if (result) {
        const indexFound = this.dataSource.findIndex(element => element._id === tramite._id)
        this.dataSource[indexFound] = result
        this.dataSource = [...this.dataSource]
      }
    });
  }
  Send(procedure: internal) {
    const data: sendDetail = {
      group: 'InternalProcedure',
      amount: procedure.cantidad,
      procedure: {
        _id: procedure._id,
        alterno: procedure.alterno
      }
    }
    const dialogRef = this.dialog.open(SendDialogComponent, {
      width: '1200px',
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.internoService.markProcedureAsSend(procedure._id).subscribe(_ => {
          const indexFound = this.dataSource.findIndex(element => element._id === procedure._id)
          this.dataSource[indexFound].enviado = true
          this.dataSource = [...this.dataSource]
        })
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


  generateRouteMap(id_tramite: string) {
    this.internoService.getAllDataInternalProcedure(id_tramite).subscribe(data => {
      createInternalRouteMap(data.procedure, data.workflow)
    })
  }

  conclude(procedure: internal) {
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
  view(procedure: internal) {
    let params: paramsNavigation = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset
    }
    if (this.paginatorService.text !== '') params.text = this.paginatorService.text
    this.router.navigate(['tramites/internos/ficha-interna', procedure._id], { queryParams: params })
  }

}
