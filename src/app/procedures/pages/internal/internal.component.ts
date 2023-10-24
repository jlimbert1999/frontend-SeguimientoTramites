import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import Swal from 'sweetalert2';
import { InternalDialogComponent } from '../../dialogs/internal-dialog/internal-dialog.component';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { createInternalRouteMap } from '../../helpers/internal-route-map';
import { SendDialogComponent } from 'src/app/communication/dialogs/send-dialog/send-dialog.component';
import { sendDetail } from 'src/app/communication/interfaces';
import { internal } from '../../interfaces';
import { InternalProcedure } from '../../models';
import { InternalService, ProcedureService } from '../../services';

@Component({
  selector: 'app-internal',
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.component.scss'],
})
export class InternalComponent implements OnInit {
  displayedColumns: string[] = [
    'alterno',
    'detalle',
    'destinatario',
    'estado',
    'fecha',
    'enviado',
    'opciones',
  ];
  dataSource: internal[] = [];

  constructor(
    private dialog: MatDialog,
    private internoService: InternalService,
    public procedureService: ProcedureService,
    private authService: AuthService,
    public paginatorService: PaginatorService,
    private router: Router,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.Get();
  }
  Get() {
    if (this.paginatorService.searchMode) {
      // this.internoService
      //   .search(
      //     this.paginatorService.limit,
      //     this.paginatorService.offset,
      //     this.paginatorService.textSearch
      //   )
      //   .subscribe((data) => {
      //     this.dataSource = data.procedures;
      //     this.paginatorService.length = data.length;
      //   });
    } else {
      this.internoService
        .Get(this.paginatorService.limit, this.paginatorService.offset)
        .subscribe((data) => {
          this.dataSource = data.procedures;
          this.paginatorService.length = data.length;
        });
    }
    console.log(this.paginatorService.searchParams);
  }

  Add() {
    const dialogRef = this.dialog.open(InternalDialogComponent, {
      width: '1000px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: internal) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop();
        }
        this.dataSource = [result, ...this.dataSource];
        this.paginatorService.length++;
      }
    });
  }
  Edit(tramite: internal) {
    const dialogRef = this.dialog.open(InternalDialogComponent, {
      width: '1000px',
      disableClose: true,
      data: tramite,
    });
    dialogRef.afterClosed().subscribe((result: internal) => {
      if (result) {
        const indexFound = this.dataSource.findIndex(
          (element) => element._id === result._id
        );
        this.dataSource[indexFound] = result;
        this.dataSource = [...this.dataSource];
      }
    });
  }
  Send(procedure: internal) {
    const data: sendDetail = {
      attachmentQuantity: procedure.amount,
      procedure: {
        _id: procedure._id,
        code: procedure.code,
      },
    };
    const dialogRef = this.dialog.open(SendDialogComponent, {
      width: '1200px',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const indexFound = this.dataSource.findIndex(
          (element) => element._id === procedure._id
        );
        this.dataSource[indexFound].send = true;
        this.dataSource = [...this.dataSource];
      }
    });
  }

  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.paginatorService.textSearch = filterValue.toLowerCase();
    // this.Get();
  }

  cancelSearch() {
    // this.paginatorService.offset = 0;
    // this.paginatorService.textSearch = '';
    // this.Get();
  }

  generateRouteMap(id_tramite: string) {
    this.procedureService.getFullProcedure(id_tramite).subscribe((data) => {
      createInternalRouteMap(
        data.procedure as InternalProcedure,
        data.workflow
      );
    });
  }

  conclude(procedure: internal) {
    Swal.fire({
      icon: 'question',
      title: `Concluir el tramite ${procedure.code}?`,
      text: `El tramite pasara a su seccion de archivos`,
      inputPlaceholder: 'Ingrese una referencia para concluir',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      customClass: {
        validationMessage: 'my-validation-message',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar una referencia para concluir'
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.internoService
          .conclude(procedure._id, result.value!)
          .subscribe((message) => {
            this.socketService.socket.emit(
              'archive',
              this.authService.account.id_dependency
            );
            Swal.fire(message, undefined, 'success');
            const index = this.dataSource.findIndex(
              (element) => element._id === procedure._id
            );
            // this.dataSource[index].state = 'CONCLUIDO';
            this.dataSource = [...this.dataSource];
          });
      }
    });
  }
  view(procedure: internal) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
    };
    this.router.navigate(['/tramites/internos', procedure._id], {
      queryParams: params,
    });
  }
}
