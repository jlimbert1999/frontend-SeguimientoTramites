import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/auth/services/loader.service';
import { InboxService } from '../../services/inbox.service';
import { DialogRemisionComponent } from '../../dialogs/dialog-remision/dialog-remision.component';
import { InternosService } from 'src/app/procedures/services/internos.service';
import { ExternosService } from 'src/app/procedures/services/externos.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { Router } from '@angular/router';
import { Entrada } from '../../models/entrada.interface';
import { createFullName } from 'src/app/helpers/fullname.helper';
import { showToast } from 'src/app/helpers/toats.helper';
import { NotificationService } from 'src/app/home-old/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
  ],
})
export class InboxComponent implements OnInit {
  dataSource: any[] = []
  displayedColumns = [
    'alterno',
    'detalle',
    'estado',
    'emisor',
    'fecha_envio',
    'opciones',
  ];
  expandedElement: any | null;

  filterOptions = [
    { value: 'interno', viewValue: 'INTERNO' },
    { value: 'externo', viewValue: 'EXTERNO' },
  ];
  Mails = this.bandejaService.Mails

  constructor(
    public bandejaService: InboxService,
    public dialog: MatDialog,
    public authService: AuthService,
    private toastr: ToastrService,
    private internoService: InternosService,
    private externoService: ExternosService,
    public loaderService: LoaderService,
    public paginatorService: PaginatorService,
    private router: Router,
    private socketService: SocketService,
    private notificationService: NotificationService
  ) {
    this.socketService.listenCancelMail().subscribe(() => {
      this.notificationService.number_mails.next(this.notificationService.number_mails.value - 1)
      this.Get()
    })
  }

  ngOnInit(): void {
    this.Get()
  }
  Get() {
    if (this.paginatorService.type) {
      this.bandejaService.Search(this.paginatorService.limit, this.paginatorService.offset, this.paginatorService.type, this.paginatorService.text).subscribe(length => {
        this.paginatorService.length = length
      })
    }
    else {
      this.bandejaService.Get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        console.log(data);
        this.paginatorService.length = length
        this.dataSource = data.mails
      })
    }
  }

  send(elemento: Entrada) {
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      width: '1200px',
      data: {
        _id: elemento.tramite._id,
        tipo: elemento.tipo,
        tramite: {
          nombre: '',
          alterno: elemento.tramite.alterno,
          cantidad: elemento.cantidad
        }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.Get()
      }
    });
  }
  aceptar_tramite(elemento: Entrada) {
    Swal.fire({
      title: `Aceptar tramite ${elemento.tramite.alterno}?`,
      text: `El tramite sera marcado como aceptado`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bandejaService.aceptMail(elemento._id).subscribe(data => {
          const indexFound = this.bandejaService.Mails.findIndex(mail => mail._id === elemento._id)
          this.bandejaService.Mails[indexFound].recibido = true
          this.bandejaService.Mails[indexFound].tramite.estado = data.state
          this.bandejaService.Mails = [...this.bandejaService.Mails]
          this.toastr.success(undefined, data.message, {
            positionClass: 'toast-bottom-right',
            timeOut: 3000,
          })
        })
      }
    })


  }
  rechazar_tramite(elemento: Entrada) {
    Swal.fire({
      icon: 'info',
      title: `Rechazar tramite ${elemento.tramite.alterno}`,
      text: `El tramite sera devuelto a ${createFullName(elemento.emisor.funcionario)}`,
      input: 'textarea',
      inputPlaceholder: 'Ingrese el motivo del rechazo',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar el motivo para el rechazo'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.bandejaService.rejectMail(elemento._id, result.value!).subscribe(message => {
          showToast('success', message)
          this.Get()
        })
      }
    })
  }
  concluir(mail: Entrada) {
    Swal.fire({
      icon: 'question',
      title: `Concluir el tramite ${mail.tramite.alterno}?`,
      text: `El tramite pasara a su seccion de archivos`,
      inputPlaceholder: 'Ingrese una referencia para concluir',
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
        this.bandejaService.Conclude(mail._id, result.value!).subscribe(message => {
          showToast('success', message)
          this.Get()
        })
      }
    })
  }



  applyFilter(event: Event) {
    if (this.paginatorService.type) {
      this.paginatorService.offset = 0
      const filterValue = (event.target as HTMLInputElement).value;
      this.paginatorService.text = filterValue;
      this.Get()
    }
  }

  selectTypeSearch() {
    if (this.paginatorService.type === undefined) {
      this.paginatorService.text = ''
    }
    this.paginatorService.offset = 0
    this.Get()
  }

  cancelSearch() {
    this.paginatorService.offset = 0;
    this.paginatorService.text = "";
    this.paginatorService.type = undefined
    this.Get();
  }


  generateRouteMap(mail: Entrada) {
    mail.tipo === 'tramites_externos'
      ? this.externoService.getAllDataExternalProcedure(mail.tramite._id).subscribe(data => {
        // externalRouteMap(data.procedure, data.workflow)
      })
      : this.internoService.getAllDataInternalProcedure(mail.tramite._id).subscribe(data => {
        // internalRouteMap(data.procedure, data.workflow)
      })

  }
  View(id_bandeja: string) {
    let params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset
    }
    if (this.paginatorService.text !== '') {
      Object.assign(params, { type: this.paginatorService.type })
      Object.assign(params, { text: this.paginatorService.text })
    }
    this.router.navigate(['home/bandejas/entrada/mail', id_bandeja], { queryParams: params })
  }




}
