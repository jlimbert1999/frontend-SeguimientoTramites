import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogRemisionComponent } from '../dialog-remision/dialog-remision.component';
import { InternoData } from '../models/interno.model';
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
  dataSource = new MatTableDataSource<InternoData>([]);

  constructor(
    public dialog: MatDialog,
    private internoService: InternosService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.mostrar_tramites()
  }
  mostrar_tramites() {
    this.internoService.getInternos().subscribe(tramites => {
      this.dataSource = new MatTableDataSource(tramites)
    })
  }
  agregar_tramite() {
    const dialogRef = this.dialog.open(DialogInternosComponent, {
      width: '1000px'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let data = this.dataSource.data
        data.unshift(result)
        this.dataSource = new MatTableDataSource(data)
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
        let data = this.dataSource.data
        const indexFound = data.findIndex(tramite => tramite._id === result._id)
        data[indexFound] = result
        this.dataSource = new MatTableDataSource(data)
      }
    });
  }
  remitir_tramite(tramite: InternoData) {
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      width: '700px',
      data: {
        id_tramite: tramite._id,
        tipo: 'tramites_internos',
        tipo_tramite: tramite.tipo_tramite.nombre,
        alterno: tramite.alterno,
        cantidad: tramite.cantidad
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

  habilitar_opciones(tramite: InternoData): boolean {
    if (tramite.ubicacion._id !== this.authService.Detalles_Cuenta.id_cuenta) {
      return true
    }
    return false
  }
}
