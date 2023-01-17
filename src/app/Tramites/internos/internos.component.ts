import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { DialogRemisionComponent } from '../dialog-remision/dialog-remision.component';
import { InternoData, TramiteInternoModel } from '../models/interno.model';
import { InternosService } from '../services/internos.service';
import { DialogInternosComponent } from './dialog-internos/dialog-internos.component';
import { HojaRutaInterna } from './pdfs/hora-ruta';

@Component({
  selector: 'app-internos',
  templateUrl: './internos.component.html',
  styleUrls: ['./internos.component.css'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500 })
  ]
})
export class InternosComponent implements OnInit {
  displayedColumns: string[] = ['alterno', 'tipo_tramite', 'detalle', 'solicitante', 'estado', 'cite', 'fecha', 'opciones']
  Data: InternoData[]
  constructor(
    public dialog: MatDialog,
    public internoService: InternosService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.mostrar_tramites()
  }
  mostrar_tramites() {
    this.internoService.getInternos().subscribe(tramites => {
      this.Data = tramites
    })
  }
  agregar_tramite() {
    const dialogRef = this.dialog.open(DialogInternosComponent, {
      width: '1000px'
    });
    dialogRef.afterClosed().subscribe((result: TramiteInternoModel) => {
      if (result) {
        this.showLoadingRequest()
        this.internoService.addInterno(result).subscribe(tramite => {
          console.log(tramite)
          if (this.Data.length === this.internoService.limit) {
            this.Data.pop()
          }
          this.Data = [tramite, ...this.Data]
          Swal.close();
        })
      }
    });
  }
  editar_tramite(tramite: InternoData) {
    const dialogRef = this.dialog.open(DialogInternosComponent, {
      width: '1000px',
      data: tramite
    });
    dialogRef.afterClosed().subscribe((result: InternoData) => {
      if (result) {
        this.showLoadingRequest()
        this.internoService.editInterno(tramite._id, result).subscribe(tramite => {
          const indexFound = this.Data.findIndex(element => element._id === tramite._id)
          this.Data[indexFound] = tramite
          this.Data = [...this.Data]
          Swal.close();
        })
      }
    });
  }
  remitir_tramite(tramite: InternoData) {
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
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.mostrar_tramites()
      }
    });
  }
  generar_hoja_ruta(id_tramite: string) {
    this.internoService.getInterno(id_tramite).subscribe(data => {
      HojaRutaInterna(data.tramite, data.workflow, 'tramites_internos')
    })
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
}
