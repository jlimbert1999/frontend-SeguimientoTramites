import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DialogExternoComponent } from './dialog-externo/dialog-externo.component';
import { DialogRemisionComponent } from '../Tramites/dialog-remision/dialog-remision.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { collapseOnLeaveAnimation, expandOnEnterAnimation, fadeInOnEnterAnimation } from 'angular-animations';
import { ExternosService } from './services/externos.service';
import Swal from 'sweetalert2';
import { Ficha } from './pdf/ficha';
import { HojaRuta } from './pdf/hoja-ruta';
import { EnvioModel } from '../Tramites/models/mail.model';
import { ExternoDto, RepresentanteDto, SolicitanteDto } from './models/Externo.dto';
import { Externo, Representante, Solicitante } from './models/Externo.interface';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-externos',
  templateUrl: './externos.component.html',
  styleUrls: ['./externos.component.css'],
  animations: [
    fadeInOnEnterAnimation(),
    expandOnEnterAnimation(),
    collapseOnLeaveAnimation(),
  ]

})
export class ExternosComponent implements OnInit, OnDestroy, AfterViewInit {

  Data: Externo[] = []
  displayedColumns: string[] = ['alterno', 'descripcion', 'estado', 'solicitante', 'fecha_registro', 'opciones'];
  filterOpions = [
    { value: 'solicitante', viewValue: 'SOLICITANTE / DNI' },
    { value: 'alterno', viewValue: 'ALTERNO' }
  ]



  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public externoService: ExternosService
  ) { }
  ngAfterViewInit(): void {
    this.paginator.pageSize = this.externoService.limit
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.Get()
  }

  Get() {
    if (this.externoService.textSearch !== '') {
      this.externoService.GetSearch().subscribe(tramites => {
        this.Data = tramites
      })
    }
    else {
      this.externoService.Get().subscribe(tramites => {
        this.Data = tramites
      })
    }
  }



  Add() {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: { tramite: ExternoDto, solicitante: SolicitanteDto, representante: RepresentanteDto | null }) => {
      if (result) {
        this.showLoadingRequest()
        this.externoService.Add(result.tramite, result.solicitante, result.representante).subscribe(tramite => {
          if (this.Data.length === this.externoService.limit) {
            this.Data.pop()
          }
          this.Data = [tramite, ...this.Data]
          Swal.close();
          this.Send(tramite)
        })
      }
    });
  }
  Edit(tramite: Externo) {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      data: tramite,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: { tramite: any, solicitante: Solicitante, representante: Representante }) => {
      if (result) {
        this.showLoadingRequest()
        this.externoService.Edit(tramite._id, result.tramite, result.solicitante, result.representante).subscribe(tramite => {
          const indexFound = this.Data.findIndex(element => element._id === tramite._id)
          this.Data[indexFound] = tramite
          this.Data = [...this.Data]
          Swal.close();
        })
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
      }
    });
  }

  pagination(page: PageEvent) {
    this.externoService.offset = page.pageIndex
    this.externoService.limit = page.pageSize
    this.Get()
  }

  denied_options(estado: string, responsable: string) {
    if (estado !== 'INSCRITO' || responsable !== this.authService.Account.id_cuenta) {
      return true
    }
    return false
  }

  GenerateHojaRuta(id_tramite: string) {
    this.externoService.getOne(id_tramite).subscribe(data => {
      HojaRuta(data.tramite, data.workflow)
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

  conclude(tramite: Externo) {
    Swal.fire({
      icon: 'question',
      title: `Concluir el tramite ${tramite.alterno}?`,
      text: `Ingrese una referencia para concluir `,
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
    this.paginator.firstPage();
    const filterValue = (event.target as HTMLInputElement).value;
    this.externoService.textSearch = filterValue.toLowerCase();
    this.Get()
  }

  cancelSearch() {
    this.paginator.firstPage();
    this.externoService.textSearch = "";
    this.Get();
  }


}

