import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/services/auth.service';
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
import { SocketService } from 'src/app/home/services/socket.service';
import { paramsNavigation } from '../../models/ProceduresProperties';


@Component({
  selector: 'app-externos',
  templateUrl: './externos.component.html',
  styleUrls: ['./externos.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
  ]

})
export class ExternosComponent implements OnInit {
  Data: Externo[] = []
  displayedColumns: string[] = ['alterno', 'detalle', 'estado', 'solicitante', 'fecha_registro', 'enviado', 'opciones'];
  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public externoService: ExternosService,
    public paginatorService: PaginatorService,
    private router: Router,
    private socket: SocketService
  ) {
  }
  ngOnInit(): void {
    this.Get()
  }

  Get() {
    if (this.paginatorService.text !== '') {
      this.externoService.GetSearch(this.paginatorService.limit, this.paginatorService.offset, this.paginatorService.text).subscribe(data => {
        this.paginatorService.length = data.length
        this.Data = data.tramites
      })
    }
    else {
      this.externoService.Get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.paginatorService.length = data.length
        this.Data = data.tramites
      })
    }
  }



  Add() {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: Externo) => {
      if (result) {
        if (this.Data.length === this.paginatorService.limit) {
          this.Data.pop()
        }
        this.Data = [result, ...this.Data]
        this.paginatorService.length++
        this.Send(result)
      }
    });
  }
  Edit(tramite: Externo) {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      data: tramite,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: Externo) => {
      if (result) {
        const indexFound = this.Data.findIndex(element => element._id === tramite._id)
        this.Data[indexFound] = result
        this.Data = [...this.Data]
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
        const indexFound = this.Data.findIndex(element => element._id === tramite._id)
        this.Data[indexFound].enviado = true
        this.Data = [...this.Data]
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
        this.externoService.conclude(tramite._id, result.value!).subscribe(message => {
          const index = this.Data.findIndex(element => element._id === tramite._id)
          this.socket.socket.emit('archive', this.authService.account.id_dependencie)
          this.Data[index].estado = 'CONCLUIDO'
          this.Data = [...this.Data]
          showToast('success', message)
        })
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



