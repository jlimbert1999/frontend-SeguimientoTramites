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
import { TestRoute } from '../../pdfs/roadMap-external';


@Component({
  selector: 'app-externos',
  templateUrl: './externos.component.html',
  styleUrls: ['./externos.component.css'],
  animations: [
    fadeInOnEnterAnimation(),
  ]

})
export class ExternosComponent implements OnInit {

  Data: Externo[] = []
  displayedColumns: string[] = ['alterno', 'descripcion', 'estado', 'solicitante', 'fecha_registro', 'opciones'];
  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public externoService: ExternosService,
    public paginatorService: PaginatorService,
    private router: Router
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
        this.Data[indexFound].estado = "EN REVISION";
        this.Data = [...this.Data]
        this.Add()
      }
    });
  }


  GenerateHojaRuta(id_tramite: string) {
    this.externoService.getOne(id_tramite).subscribe(data => {
      TestRoute(data.tramite, data.workflow)
      // HojaRutaExterna(data.tramite, data.workflow, this.authService.account.id_cuenta)
    })
  }
  GenerateFicha(tramite: Externo) {
    Ficha(tramite)
  }
  showLoadingRequest() {
    Swal.fire({
      title: 'Guardando....',
      text: 'Por favor espere',
      allowOutsideClick: false,
    });
    Swal.showLoading()
  }

  cancel(tramite: Externo) {
    Swal.fire({
      icon: 'question',
      title: `Anular el tramite ${tramite.alterno}?`,
      text: `Ingrese una referencia para anular`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar una referencia para la conclusion'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Esta seguro en anular el tramite ${tramite.alterno}?`,
          text: `El tramite ya no se mostrara en su listado de tramites`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
        }).then((confirm) => {
          if (confirm.isConfirmed) {
            this.externoService.cancelProcedure(tramite._id, result.value!).subscribe(message => {
              Swal.fire(message, undefined, 'success')
              this.Get()
            })
          }
        })
      }
    })
  }
  conclude(tramite: Externo) {
    Swal.fire({
      icon: 'question',
      title: `Concluir el tramite ${tramite.alterno}?`,
      text: `Ingrese una referencia para concluir`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar una referencia para la conclusion'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.externoService.conclude(tramite._id, result.value!).subscribe(message => {
          Swal.fire(message, undefined, 'success')
          const index = this.Data.findIndex(element => element._id === tramite._id)
          this.Data[index].estado = 'CONCLUIDO'
          this.Data = [...this.Data]
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

  View(id: string) {
    let params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset
    }
    if (this.paginatorService.text !== '') {
      Object.assign(params, { text: this.paginatorService.text })
    }
    this.router.navigate(['home/tramites/externos/ficha-externa', id], { queryParams: params })
  }






}

