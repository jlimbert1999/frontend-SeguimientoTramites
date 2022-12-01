import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { DialogRemisionComponent } from '../dialog-remision/dialog-remision.component';
import { BandejaEntradaModel_View } from '../models/mail.model';
import { BandejaService } from '../services/bandeja.service';

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
  ],
})
export class BandejaEntradaComponent implements OnInit {
  displayedColumns = ['grupo', 'alterno', 'tipo', 'estado', 'receptor', 'fecha_envio', 'opciones', 'expand']
  expandedElement: any | null;

  isLoadingResults = true;


  constructor(
    public bandejaService: BandejaService,
    public dialog: MatDialog,
    public authService: AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.bandejaService.obtener_bandejaEntrada().subscribe()
  }

  remitir_tramite(elemento: BandejaEntradaModel_View) {
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      width: '700px',
      data: {
        envio: {
          _id: elemento.tramite._id,
          tipo: elemento.tipo,
          estado: elemento.tramite.estado,
          tipo_tramite: elemento.tramite.tipo_tramite.nombre,
          alterno: elemento.tramite.alterno
        },
        reenvio: null
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bandejaService.obtener_bandejaEntrada().subscribe()
      }
    });
  }
  aceptar_tramite(elemento: any) {
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
        this.bandejaService.aceptar_tramite(elemento.tramite._id, elemento.cuenta_emisor._id).subscribe(message => {
          this.bandejaService.obtener_bandejaEntrada().subscribe()
          this.toastr.info(undefined, message, {
            positionClass: 'toast-bottom-right',
            timeOut: 3000,
          })
        })

      }
    })


  }
  rechazar_tramite(elemento: BandejaEntradaModel_View) {
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
          this.bandejaService.rechazar_tramite(elemento.tramite._id, elemento.cuenta_emisor._id, result.value).subscribe(message => {
            this.toastr.info(undefined, message, {
              positionClass: 'toast-bottom-right',
              timeOut: 3000,
            })
          })
          this.bandejaService.obtener_bandejaEntrada().subscribe()


        } else {
          Swal.fire({
            title: "Debe ingrese el motivo para rechazar",
            icon: 'warning'
          })
        }

      }
    })
  }

}
