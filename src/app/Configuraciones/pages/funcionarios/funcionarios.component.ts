import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { read, utils } from "xlsx";
import Swal from 'sweetalert2';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { UsuariosService } from '../../services/usuarios.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { officer } from '../../interfaces/oficer.interface';
import { WorkHistoryComponent } from '../../dialogs/work-history/work-history.component';
import { OfficerDialogComponent } from '../../dialogs/officer-dialog/officer-dialog.component';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
  ]
})
export class FuncionariosComponent implements OnInit, OnDestroy {
  dataSource: officer[] = []
  displayedColumns = ['nombre', 'dni', 'cargo', 'telefono', 'activo', 'opciones']
  text: string = ''

  constructor(
    private funcionariosService: UsuariosService,
    private paginatorService: PaginatorService,
    public dialog: MatDialog) {
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.Get()
  }
  Get() {
    if (this.text !== '') {
      this.funcionariosService.search(this.paginatorService.limit, this.paginatorService.offset, this.text).subscribe(data => {
        this.dataSource = data.officers
        this.paginatorService.length = data.length
      })
    }
    else {
      this.funcionariosService.get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.officers
        this.paginatorService.length = data.length
      })
    }
  }

  Add() {
    const dialogRef = this.dialog.open(OfficerDialogComponent, {
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe((result: officer) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop()
        }
        this.paginatorService.length++
        this.dataSource = [result, ...this.dataSource]
      }
    });

  }

  Edit(officer: officer) {
    const dialogRef = this.dialog.open(OfficerDialogComponent, {
      width: '1200px',
      data: officer
    });
    dialogRef.afterClosed().subscribe((result: officer) => {
      if (result) {
        const indexFound = this.dataSource.findIndex(officer => officer._id === result._id)
        this.dataSource[indexFound] = result
        this.dataSource = [...this.dataSource]
      }
    });
  }

  delete(officer: officer) {
    this.funcionariosService.delete(officer._id).subscribe(newOfficer => {
      const indexFound = this.dataSource.findIndex(element => element._id === officer._id)
      this.dataSource[indexFound].activo = newOfficer.activo
      this.dataSource = [...this.dataSource]
    })
  }

  viewWorkHistory(officer: officer) {
    this.dialog.open(WorkHistoryComponent,
      { width: '800px', data: officer }
    );
  }

  async cargar_usuarios() {
    const { value: file } = await Swal.fire({
      title: 'Seleccione el archivo',
      text: 'Formato: Cargo / Nombres / Paterno / Materno / DNI / Expedido / Telefono / Direccion',
      input: 'file',
      confirmButtonText: 'Aceptar',
      inputAttributes: {
        'aria-label': 'Seleccione el archivo a cargar'
      }
    })
    if (file) {
      this.ReadExcel(file)
    }
  }
  ReadExcel(File: File) {
    let usersDB: any[] = []
    let user: any
    let fileReader = new FileReader()
    fileReader.readAsBinaryString(File)
    fileReader.onload = (e) => {
      let listUsuarios = read(fileReader.result, { type: 'binary' })
      let schemasNames = listUsuarios.SheetNames
      let ExcelData = utils.sheet_to_json(listUsuarios.Sheets[schemasNames[0]])
      let keysData
      try {
        ExcelData.forEach((data: any) => {
          keysData = Object.keys(data)
          user = {
            nombre: data[keysData[1]],
            paterno: data[keysData[2]],
            materno: data[keysData[3]],
            cargo: data[keysData[0]],
            dni: data[keysData[4]],
            telefono: data[keysData[6]],
            direccion: data[keysData[7]]
          }
          usersDB.push(user)
        });
      } catch (error) {
        Swal.fire({
          title: 'Error al cargar el archivo, verifique el formato para la carga',
          icon: 'error'
        })
      }
      // this.funcionariosService.agregar_multiples_funcionarios(usersDB).subscribe(funcionarios => {
      //   this.mostrar_funcionarios()
      // })
    }
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
