import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioDialogComponent } from '../cuentas/usuario-dialog/usuario-dialog.component';
import { UsuariosService } from '../services/usuarios.service';
import { read, utils } from "xlsx";
import Swal from 'sweetalert2';
import { UsuarioModel } from '../models/usuario.model';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit, OnDestroy {
  Funcionarios: any[] = []
  displayedColumns = [
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'paterno', titulo: 'Paterno' },
    { key: 'materno', titulo: 'Materno' },
    { key: 'dni', titulo: 'Dni' },
    { key: 'cargo', titulo: 'Cargo' },
    { key: 'telefono', titulo: 'Telefono' },
    { key: 'activo', titulo: 'Situacion' },
    { key: 'movilidad', titulo: 'Movilidad' },
  ]
  constructor(private funcionariosService: UsuariosService, public dialog: MatDialog,) {
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.mostrar_funcionarios()
  }
  sgregar_funcionario() {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '900px'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.mostrar_funcionarios()
      }
    });

  }
  mostrar_funcionarios() {
    this.funcionariosService.obtener_funcionarios().subscribe(users => {
      this.Funcionarios = users
    })
  }
  editar_funcionario(data: any) {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '900px',
      data
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.mostrar_funcionarios()
      }
    });
  }

  cambiar_situacion(data: any) {
    this.funcionariosService.cambiar_situacion(data._id, data.activo).subscribe(funcionario => {
      this.mostrar_funcionarios()
    })
  }

  async cargar_usuarios() {
    const { value: file } = await Swal.fire({
      title: 'Seleccione el archivo',
      text: 'Formato Cabeceras: Cargo / Nombres / Paterno / Materno / DNI / Expedido / Telefono / Direccion',
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
    let usersDB: UsuarioModel[] = []
    let user: UsuarioModel
    let fileReader = new FileReader()
    fileReader.readAsBinaryString(File)
    fileReader.onload = (e) => {
      let listUsuarios = read(fileReader.result, { type: 'binary' })
      let schemasNames = listUsuarios.SheetNames
      let ExcelData = utils.sheet_to_json(listUsuarios.Sheets[schemasNames[0]])
      try {
        ExcelData.forEach((data: any) => {
          user = {
            nombre: data['__EMPTY_2'],
            paterno: data['__EMPTY_3'],
            materno: data['__EMPTY_4'],
            cargo: data['__EMPTY_1'],
            dni: data['__EMPTY_5'],
            expedido: data['__EMPTY_6'],
            telefono: data['__EMPTY_7'],
            direccion: data['__EMPTY_8']
          }
          usersDB.push(user)
        });
        // eliminar cabeceras
        usersDB.shift()
      } catch (error) {
        Swal.fire({
          title: 'Error al cargar el archivo, verifique el formato para la carga',
          icon: 'error'
        })
      }
      this.funcionariosService.agregar_multiples_funcionarios(usersDB).subscribe(funcionarios => {
        this.mostrar_funcionarios()
      })
    }

  }





}
