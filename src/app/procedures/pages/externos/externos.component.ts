import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ExternosService } from '../../services/externos.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { DialogExternoComponent } from '../../dialogs/dialog-externo/dialog-externo.component';
import { paramsNavigation } from '../../models/ProceduresProperties';
import { external } from '../../interfaces/external.interface';
import { createExternalRouteMap } from '../../helpers/external-route-map';
import { Ficha } from '../../helpers/ficha';
import { SendDialogComponent } from 'src/app/communication/dialogs/send-dialog/send-dialog.component';
import { sendDetail } from 'src/app/communication/interfaces';


@Component({
  selector: 'app-externos',
  templateUrl: './externos.component.html',
  styleUrls: ['./externos.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
  ]

})
export class ExternosComponent implements OnInit {
  dataSource: external[] = []
  displayedColumns: string[] = ['alterno', 'detalle', 'estado', 'solicitante', 'fecha_registro', 'enviado', 'opciones'];
  constructor(
    public dialog: MatDialog,
    public externoService: ExternosService,
    public paginatorService: PaginatorService,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this.Get()
  }

  Get() {
    if (this.paginatorService.text !== '') {
      this.externoService.GetSearch(this.paginatorService.limit, this.paginatorService.offset, this.paginatorService.text).subscribe(data => {
        this.paginatorService.length = data.length
        this.dataSource = data.procedures
      })
    }
    else {
      this.externoService.Get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.paginatorService.length = data.length
        this.dataSource = data.procedures
      })
    }
  }



  Add() {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: external) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop()
        }
        this.dataSource = [result, ...this.dataSource]
        this.paginatorService.length++
        // this.Send(result)
      }
    });
  }
  Edit(tramite: external) {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      data: tramite,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: external) => {
      if (result) {
        const indexFound = this.dataSource.findIndex(element => element._id === tramite._id)
        this.dataSource[indexFound] = result
        this.dataSource = [...this.dataSource]
        // showToast('success', 'Tramite guardado')
      }
    });
  }


  Send(procedure: external) {
    const { _id, alterno, cantidad } = procedure
    const data: sendDetail = {
      group: 'ExternalProcedure',
      amount: cantidad,
      procedure: {
        _id,
        alterno
      }
    }
    const dialogRef = this.dialog.open(SendDialogComponent, {
      width: '1200px',
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.externoService.markProcedureAsSend(procedure._id).subscribe(_ => {
        //   const indexFound = this.dataSource.findIndex(element => element._id === procedure._id)
        //   this.dataSource[indexFound].enviado = true
        //   this.dataSource = [...this.dataSource]
        //   this.Add()
        // })
      }
    });
  }

  GenerateHojaRuta(id_tramite: string) {
    this.externoService.getAllDataExternalProcedure(id_tramite).subscribe(data => {
      createExternalRouteMap(data.procedure, data.workflow)
      // externalRouteMap(data.procedure, data.workflow)
    })
  }
  GenerateFicha(tramite: external) {
    Ficha(tramite)
  }
  conclude(tramite: external) {
    Swal.fire({
      icon: 'question',
      title: `Concluir el tramite ${tramite.alterno}?`,
      text: `El tramite pasara a su seccion de archivos`,
      input: 'textarea',
      inputPlaceholder: 'Ingrese una referencia para concluir',
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
        // this.externoService.conclude(tramite._id, result.value!).subscribe(message => {
        //   const index = this.Data.findIndex(element => element._id === tramite._id)
        //   this.socket.socket.emit('archive', this.authService.account.id_dependencie)
        //   this.Data[index].estado = 'CONCLUIDO'
        //   this.Data = [...this.Data]
        //   showToast('success', message)
        // })
      }
    })
  }

  async applyFilter(event: Event) {
    this.paginatorService.offset = 0
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginatorService.text = filterValue;
    this.Get()
  }

  cancelSearch() {
    this.paginatorService.offset = 0;
    this.paginatorService.text = "";
    this.Get();
  }

  view(procedure: external) {
    let params: paramsNavigation = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset
    }
    if (this.paginatorService.text !== '') params.text = this.paginatorService.text
    this.router.navigate(['tramites/externos/ficha-externa', procedure._id], { queryParams: params })
  }
}



