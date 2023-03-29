import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogTiposComponent } from './dialog-tipos/dialog-tipos.component';
import { TiposTramitesService } from '../../services/tipos-tramites.service';
import { TipoTramite } from '../../models/tipoTramite.interface';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { fadeInOnEnterAnimation } from 'angular-animations';


@Component({
  selector: 'app-tipos-tramites',
  templateUrl: './tipos-tramites.component.html',
  styleUrls: ['./tipos-tramites.component.css'],
  animations: [
    fadeInOnEnterAnimation()
  ]
})
export class TiposTramitesComponent implements OnInit {
  dataSource: TipoTramite[] = []
  displayedColumns = ['nombre', 'segmento', 'activo', 'opciones']
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
    const dialogRef = this.dialog.open(DialogTiposComponent, {
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe((result: TipoTramite) => {
      if (result) {
        let data = [result, ...this.dataSource]
        this.dataSource = data
      }
    });
  }
  Edit(tipoTramite: TipoTramite) {
    const dialogRef = this.dialog.open(DialogTiposComponent, {
      width: '1200px',
      data: tipoTramite
    });
    dialogRef.afterClosed().subscribe((result: TipoTramite) => {
      if (result) {
        let newData = [...this.dataSource]
        const foundIndex = newData.findIndex(tipo => tipo.id_tipoTramite === result.id_tipoTramite);
        newData[foundIndex] = result;
        this.dataSource = newData
      }
    });
  }
  Get() {
    if (this.text !== '') {
      this.tiposTramitesService.search(this.paginatorService.limit, this.paginatorService.offset, this.text).subscribe(data => {
        this.dataSource = data.tipos
        this.paginatorService.length = data.length
      })
    }
    else {
      this.tiposTramitesService.get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.tipos
        this.paginatorService.length = data.length
      })
    }
  }

  Delete(data: TipoTramite) {
    this.tiposTramitesService.delete(data.id_tipoTramite).subscribe(inst => {
      let newData = [...this.dataSource]
      const foundIndex = newData.findIndex(tipo => tipo.id_tipoTramite === data.id_tipoTramite);
      newData[foundIndex] = inst
      this.dataSource = newData
    })
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
