import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ExternosService } from '../../services/externos.service';
import { DialogExternoComponent } from '../../dialogs/dialog-externo/dialog-externo.component';
import { createExternalRouteMap } from '../../helpers/external-route-map';
import { Ficha } from '../../helpers/ficha';
import { SendDialogComponent } from 'src/app/communication/dialogs/send-dialog/send-dialog.component';
import { sendDetail } from 'src/app/communication/interfaces';
import { external } from '../../interfaces/external.interface';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { ProcedureService } from '../../services/procedure.service';
import { ExternalProcedure } from '../../models';
import { ArchivoService } from 'src/app/archives/services/archivo.service';
import { stateProcedure } from '../../interfaces';
import { EventProcedureDto } from 'src/app/archives/dtos/event_procedure.dto';

@Component({
  selector: 'app-externos',
  templateUrl: './externos.component.html',
  styleUrls: ['./externos.component.scss'],
})
export class ExternosComponent implements OnInit {
  dataSource: external[] = [];
  displayedColumns: string[] = [
    'alterno',
    'detalle',
    'estado',
    'solicitante',
    'fecha_registro',
    'enviado',
    'opciones',
  ];
  stateProcedure: stateProcedure;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private readonly externoService: ExternosService,
    private readonly procedureService: ProcedureService,
    private readonly paginatorService: PaginatorService,
    private readonly archivosService: ArchivoService
  ) {}
  ngOnInit(): void {
    this.Get();
  }

  Get() {
    if (this.paginatorService.textSearch !== '') {
      this.externoService
        .GetSearch(
          this.paginatorService.textSearch,
          this.paginatorService.limit,
          this.paginatorService.offset
        )
        .subscribe((data) => {
          this.dataSource = data.procedures;
          this.paginatorService.length = data.length;
        });
    } else {
      this.externoService
        .Get(this.paginatorService.limit, this.paginatorService.offset)
        .subscribe((data) => {
          this.dataSource = data.procedures;
          this.paginatorService.length = data.length;
        });
    }
  }

  Add() {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: external) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop();
        }
        this.dataSource = [result, ...this.dataSource];
        this.Send(result);
      }
    });
  }

  Edit(tramite: external) {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      data: tramite,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: external) => {
      if (result) {
        const indexFound = this.dataSource.findIndex(
          (element) => element._id === tramite._id
        );
        this.dataSource[indexFound] = result;
        this.dataSource = [...this.dataSource];
      }
    });
  }

  Send(procedure: external) {
    const { _id, code, amount } = procedure;
    const data: sendDetail = {
      attachmentQuantity: amount,
      procedure: {
        _id,
        code,
      },
    };
    const dialogRef = this.dialog.open(SendDialogComponent, {
      width: '1200px',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const indexFound = this.dataSource.findIndex(
          (element) => element._id === procedure._id
        );
        this.dataSource[indexFound].send = true;
        this.dataSource = [...this.dataSource];
      }
    });
  }

  generateRouteMap(id_procedure: string) {
    this.procedureService.getFullProcedure(id_procedure).subscribe((data) => {
      createExternalRouteMap(
        data.procedure as ExternalProcedure,
        data.workflow
      );
    });
  }

  GenerateFicha(tramite: external) {
    Ficha(tramite);
  }

  conclude(procedure: external) {
    Swal.fire({
      icon: 'question',
      title: `¿Concluir tramite ${procedure.code}?`,
      text: `Los tramites concluidos desde su administacion ya no podran ser desarchivados`,
      input: 'textarea',
      inputPlaceholder: 'Ingrese una referencia para concluir',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> La referencia es obligatoria!'
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const archive: EventProcedureDto = {
          procedure: procedure._id,
          description: result.value,
          stateProcedure: stateProcedure.CONCLUIDO,
        };
        this.archivosService
          .archiveProcedure(procedure._id, archive)
          .subscribe((message) => {
            const indexFound = this.dataSource.findIndex(
              (element) => element._id === procedure._id
            );
            this.dataSource[indexFound].state = stateProcedure.CONCLUIDO;
          });
      }
    });
  }

  async applyFilter(text: string) {
    this.paginatorService.offset = 0;
    this.paginatorService.textSearch = text;
    this.Get();
  }

  cancelSearch() {
    // this.paginatorService.offset = 0;
    // this.paginatorService.text = '';
    this.Get();
  }

  view(procedure: external) {
    const params = {
      limit: this.paginatorService.limit,
      offset: this.paginatorService.offset,
      ...(this.paginatorService.textSearch !== '' && {
        text: this.paginatorService.textSearch,
      }),
    };
    this.router.navigate(['/tramites/externos', procedure._id], {
      queryParams: params,
    });
  }
  get textSearch() {
    return this.paginatorService.textSearch;
  }
}
