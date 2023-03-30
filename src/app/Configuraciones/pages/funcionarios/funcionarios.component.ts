import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioDialogComponent } from '../cuentas/usuario-dialog/usuario-dialog.component';
import { read, utils } from "xlsx";
import Swal from 'sweetalert2';
import { UsuariosService } from '../../services/usuarios.service';
import { Funcionario, FuncionarioDto } from '../../models/funcionario.interface';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css'],
  animations: [
    fadeInOnEnterAnimation(),
  ]
})
export class FuncionariosComponent implements OnInit, OnDestroy {
  dataSource: Funcionario[] = []
  displayedColumns = ['cuenta', 'nombre', 'dni', 'cargo', 'telefono', 'activo', 'opciones']
  text: string = ''

  constructor(
    private funcionariosService: UsuariosService,
    private paginatorService: PaginatorService,
    public dialog: MatDialog,) {
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.Get()
  }
  Add() {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '900px'
    });
    dialogRef.afterClosed().subscribe((result: Funcionario) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop()
        }
        this.paginatorService.length++
        this.dataSource = [result, ...this.dataSource]
      }
    });

  }
  Get() {
    if (this.text !== '') {
      this.funcionariosService.search(this.paginatorService.limit, this.paginatorService.offset, this.text).subscribe(data => {
        this.dataSource = data.funcionarios
        this.paginatorService.length = data.length
      })
    }
    else {
      this.funcionariosService.get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.funcionarios
        this.paginatorService.length = data.length
      })
    }

  }
  Edit(data: Funcionario) {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '900px',
      data
    });
    dialogRef.afterClosed().subscribe((result: Funcionario) => {
      if (result) {
        const indexFound = this.dataSource.findIndex(funcionario => funcionario._id === data._id)
        this.dataSource[indexFound] = result
        this.dataSource = [...this.dataSource]
      }
    });
  }

  Delete(data: Funcionario) {
    this.funcionariosService.delete(data._id).subscribe(funcionario => {
      const indexFound = this.dataSource.findIndex(funcionario => funcionario._id === data._id)
      this.dataSource[indexFound] = funcionario
      this.dataSource = [...this.dataSource]
    })
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
    let usersDB: FuncionarioDto[] = []
    let user: FuncionarioDto
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
