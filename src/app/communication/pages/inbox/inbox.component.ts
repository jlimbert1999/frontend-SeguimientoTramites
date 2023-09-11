import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InboxService } from '../../services/inbox.service';
import { SendDialogComponent } from '../../dialogs/send-dialog/send-dialog.component';
import { InternosService } from 'src/app/procedures/services/internos.service';
import { ExternosService } from 'src/app/procedures/services/externos.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { NotificationService } from 'src/app/home-old/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';
import { inbox } from '../../interfaces/inbox.interface';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit, OnDestroy {
  private mailSubscription: Subscription;
  dataSource: inbox[] = [];
  displayedColumns = [
    'alterno',
    'detalle',
    'estado',
    'emisor',
    'fecha_envio',
    'opciones',
  ];

  constructor(
    public bandejaService: InboxService,
    public dialog: MatDialog,
    public authService: AuthService,
    public paginatorService: PaginatorService,
    private router: Router,
    private socketService: SocketService,
    private notificationService: NotificationService
  ) {
    // this.socketService.listenCancelMail().subscribe(() => {
    //   this.notificationService.number_mails.next(this.notificationService.number_mails.value - 1);
    //   this.Get();
    // })
    this.mailSubscription = this.socketService.mailSubscription$.subscribe(
      (data) => {
        this.dataSource = [data, ...this.dataSource];
      }
    );
  }

  ngOnInit(): void {
    this.Get();
  }

  ngOnDestroy(): void {
    if (this.mailSubscription) this.mailSubscription.unsubscribe();
  }

  Get() {
    if (this.paginatorService.textSearch != '') {
      this.bandejaService
        .Search(
          this.paginatorService.limit,
          this.paginatorService.offset,
          this.paginatorService.textSearch
        )
        .subscribe((resp) => {
          this.dataSource = resp.mails;
          this.paginatorService.length = resp.length;
        });
    } else {
      this.bandejaService
        .Get(this.paginatorService.limit, this.paginatorService.offset)
        .subscribe((resp) => {
          this.dataSource = resp.mails;
          this.paginatorService.length = resp.length;
        });
    }
  }

  send(elemento: inbox) {
    // const dialogRef = this.dialog.open(SendDialogComponent, {
    //   width: '1200px',
    //   data: {
    //     _id: elemento.tramite._id,
    //     tipo: elemento.tipo,
    //     tramite: {
    //       nombre: '',
    //       alterno: elemento.tramite.alterno,
    //       cantidad: elemento.cantidad
    //     }
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.Get()
    //   }
    // });
  }
  acceptMail(mail: inbox) {
    Swal.fire({
      title: `¿Aceptar tramite ${mail.tramite.code}?`,
      text: `El tramite sera marcado como aceptado`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.bandejaService.aceptMail(elemento._id).subscribe((data) => {
        //   // const indexFound = this.bandejaService.Mails.findIndex(mail => mail._id === elemento._id)
        //   // this.bandejaService.Mails[indexFound].recibido = true
        //   // this.bandejaService.Mails[indexFound].tramite.estado = data.state
        //   // this.bandejaService.Mails = [...this.bandejaService.Mails]
        //   // this.toastr.success(undefined, data.message, {
        //   //   positionClass: 'toast-bottom-right',
        //   //   timeOut: 3000,
        //   // })
        // });
      }
    });
  }
  rejectMail(mail: inbox) {
    Swal.fire({
      icon: 'question',
      title: `¿Rechazar tramite ${mail.tramite.code}?`,
      text: `El tramite sera devuelto al funcionario emisor`,
      input: 'textarea',
      inputPlaceholder: 'Ingrese el motivo del rechazo',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar el motivo para el rechazo'
          );
        }
      },
    }).then((result) => {
      // if (result.isConfirmed) {
      //   this.bandejaService.rejectMail(elemento._id, result.value!).subscribe(message => {
      //     showToast('success', message)
      //     this.Get()
      //   })
      // }
    });
  }
  concluir(mail: inbox) {
    Swal.fire({
      icon: 'question',
      title: `Concluir el tramite ${mail.tramite}?`,
      text: `El tramite pasara a su seccion de archivos`,
      inputPlaceholder: 'Ingrese una referencia para concluir',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar una referencia para la conclusion'
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.bandejaService
          .Conclude(mail._id, result.value!)
          .subscribe((message) => {
            this.Get();
          });
      }
    });
  }

  applyFilter(event: Event) {
    this.paginatorService.offset = 0;
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginatorService.textSearch = filterValue;
    this.Get();
  }

  cancelSearch() {
    // this.paginatorService.offset = 0;
    // this.paginatorService.text = '';
    // this.paginatorService.type = undefined;
    // this.Get();
  }

  generateRouteMap(mail: inbox) {
    // mail.tipo === 'tramites_externos'
    //   ? this.externoService
    //       .getAllDataExternalProcedure(mail.tramite._id)
    //       .subscribe((data) => {
    //         // externalRouteMap(data.procedure, data.workflow)
    //       })
    //   : this.internoService
    //       .getAllDataInternalProcedure(mail.tramite._id)
    //       .subscribe((data) => {
    //         // internalRouteMap(data.procedure, data.workflow)
    //       });
  }
  view(id_bandeja: string) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
    };
    // if (this.paginatorService.text !== '') {
    //   Object.assign(params, { type: this.paginatorService.type });
    //   Object.assign(params, { text: this.paginatorService.text });
    // }
    this.router.navigate(['/bandejas/entrada', id_bandeja], {
      queryParams: params,
    });
  }
}
