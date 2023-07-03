import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TiposTramitesService } from '../../services/tipos-tramites.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { typeProcedure } from '../../interfaces/typeProcedure.interface';
import { TypeProcedureDialogComponent } from '../../dialogs/type-procedure-dialog/type-procedure-dialog.component';


@Component({
  selector: 'app-tipos-tramites',
  templateUrl: './tipos-tramites.component.html',
  styleUrls: ['./tipos-tramites.component.scss'],
  animations: [
    fadeInOnEnterAnimation()
  ]
})
export class TiposTramitesComponent implements OnInit {
  dataSource: typeProcedure[] = []
  displayedColumns = ['nombre', 'segmento', 'activo', 'options']
  text: string = ''

  constructor(
    public dialog: MatDialog,
    public tiposTramitesService: TiposTramitesService,
    private paginatorService: PaginatorService
  ) { }


  ngOnInit(): void {
    this.Get()
  }

  Add() {
    const dialogRef = this.dialog.open(TypeProcedureDialogComponent, {
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe((result: typeProcedure) => {
      if (result) {
        let data = [result, ...this.dataSource]
        this.dataSource = data
      }
    });
  }
  Edit(tipoTramite: typeProcedure) {
    const dialogRef = this.dialog.open(TypeProcedureDialogComponent, {
      width: '1200px',
      data: tipoTramite
    });
    dialogRef.afterClosed().subscribe((result: typeProcedure) => {
      if (result) {
        let newData = [...this.dataSource]
        const foundIndex = newData.findIndex(tipo => tipo._id === result._id);
        newData[foundIndex] = result;
        this.dataSource = newData
      }
    });
  }
  Get() {
    if (this.text !== '') {
      // this.tiposTramitesService.search(this.paginatorService.limit, this.paginatorService.offset, this.text).subscribe(data => {
      //   this.dataSource = data.tipos
      //   this.paginatorService.length = data.length
      // })
    }
    else {
      this.tiposTramitesService.get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        console.log(data);
        this.dataSource = data.tipos
        this.paginatorService.length = data.length
      })
    }
  }

  Delete(data: typeProcedure) {
    // this.tiposTramitesService.delete(data._id).subscribe(inst => {
    //   let newData = [...this.dataSource]
    //   const foundIndex = newData.findIndex(tipo => tipo._id === data._id);
    //   newData[foundIndex] = inst
    //   this.dataSource = newData
    // })
  }

  applyFilter(event: Event) {
    this.paginatorService.offset = 0
    this.text = (event.target as HTMLInputElement).value;
    this.Get()
  }
  cancelSearch() {
    this.paginatorService.offset = 0
    this.text = ''
    this.Get()
  }

}
