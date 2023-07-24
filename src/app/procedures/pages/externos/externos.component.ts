import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { Externo } from '../../models/Externo.interface';
import { ExternosService } from '../../services/externos.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { DialogExternoComponent } from '../../dialogs/dialog-externo/dialog-externo.component';
import { DialogRemisionComponent } from 'src/app/Bandejas/dialogs/dialog-remision/dialog-remision.component';
import { HojaRutaExterna } from '../../pdfs/hoja-ruta-externa';
import { Ficha } from '../../pdfs/ficha';
import { externalRouteMap } from '../../pdfs/roadMap';
import { showToast } from 'src/app/helpers/toats.helper';
import { paramsNavigation } from '../../models/ProceduresProperties';
import { SocketService } from 'src/app/services/socket.service';
import { external } from '../../interfaces/external.interface';


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
      // this.externoService.GetSearch(this.paginatorService.limit, this.paginatorService.offset, this.paginatorService.text).subscribe(data => {
      //   this.paginatorService.length = data.length
      //   this.dataSource = data.tramites
      // })
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


  Send(tramite: Externo) {
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      width: '1200px',
      data: {
        _id: tramite._id,
        tipo: 'tramites_externos',
        tramite: {
          alterno: tramite.alterno,
          cantidad: tramite.cantidad
        }
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const indexFound = this.dataSource.findIndex(element => element._id === tramite._id)
        // this.dataSource[indexFound].enviado = true
        this.dataSource = [...this.dataSource]
        this.Add()
      }
    });
  }


  GenerateHojaRuta(id_tramite: string) {
    this.externoService.getAllDataExternalProcedure(id_tramite).subscribe(data => {
      externalRouteMap(data.procedure, data.workflow)
    })
  }
  GenerateFicha(tramite: Externo) {
    Ficha(tramite)
  }
  conclude(tramite: Externo) {
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

  applyFilter(event: Event) {
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

  view(procedure: Externo) {
    let params: paramsNavigation = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset
    }
    if (this.paginatorService.text !== '') params.text = this.paginatorService.text
    this.router.navigate(['home/tramites/externos/ficha-externa', procedure._id], { queryParams: params })
  }
}



