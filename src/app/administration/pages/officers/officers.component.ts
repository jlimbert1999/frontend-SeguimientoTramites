import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { read, utils } from 'xlsx';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../services/usuarios.service';
import { officer } from '../../interfaces/oficer.interface';
import { WorkHistoryComponent } from '../../dialogs/work-history/work-history.component';
import { OfficerDialogComponent } from '../../dialogs/officer-dialog/officer-dialog.component';
import { PaginatorService } from 'src/app/shared/services';

@Component({
  selector: 'app-officers',
  templateUrl: './officers.component.html',
  styleUrls: ['./officers.component.scss'],
})
export class OfficersComponent implements OnInit, OnDestroy {
  dataSource = signal<officer[]>([]);
  displayedColumns = ['nombre', 'dni', 'cargo', 'telefono', 'activo', 'opciones'];
  text: string = '';

  constructor(
    private funcionariosService: UsuariosService,
    private paginatorService: PaginatorService,
    public dialog: MatDialog
  ) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    const subscription =
      this.text !== ''
        ? this.funcionariosService.search({ ...this.paginatorService.PaginationParams, text: this.text })
        : this.funcionariosService.findAll(this.paginatorService.PaginationParams);
    subscription.subscribe((data) => {
      this.dataSource.set(data.officers);
      this.paginatorService.length = data.length;
    });
  }

  add() {
    const dialogRef = this.dialog.open(OfficerDialogComponent, {
      width: '800px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: officer) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.paginatorService.length++;
    });
  }

  edit(officer: officer) {
    const dialogRef = this.dialog.open(OfficerDialogComponent, {
      width: '800px',
      data: officer,
    });
    dialogRef.afterClosed().subscribe((result: officer) => {
      if (result) {
        // const indexFound = this.dataSource.findIndex((officer) => officer._id === result._id);
        // this.dataSource[indexFound] = result;
        // this.dataSource = [...this.dataSource];
      }
    });
  }

  delete(officer: officer) {
    // this.funcionariosService.delete(officer._id).subscribe((newOfficer) => {
    //   const indexFound = this.dataSource.findIndex((element) => element._id === officer._id);
    //   this.dataSource[indexFound].activo = newOfficer.activo;
    //   this.dataSource = [...this.dataSource];
    // });
  }

  viewWorkHistory(officer: officer) {
    this.dialog.open(WorkHistoryComponent, { width: '800px', data: officer });
  }

  async cargar_usuarios() {
    const { value: file } = await Swal.fire({
      title: 'Seleccione el archivo',
      text: 'Formato: Cargo / Nombres / Paterno / Materno / DNI / Expedido / Telefono / Direccion',
      input: 'file',
      confirmButtonText: 'Aceptar',
      inputAttributes: {
        'aria-label': 'Seleccione el archivo a cargar',
      },
    });
    if (file) {
      this.ReadExcel(file);
    }
  }
  ReadExcel(File: File) {
    let usersDB: any[] = [];
    let user: any;
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(File);
    fileReader.onload = (e) => {
      let listUsuarios = read(fileReader.result, { type: 'binary' });
      let schemasNames = listUsuarios.SheetNames;
      let ExcelData = utils.sheet_to_json(listUsuarios.Sheets[schemasNames[0]]);
      let keysData;
      try {
        ExcelData.forEach((data: any) => {
          keysData = Object.keys(data);
          user = {
            nombre: data[keysData[1]],
            paterno: data[keysData[2]],
            materno: data[keysData[3]],
            cargo: data[keysData[0]],
            dni: data[keysData[4]],
            telefono: data[keysData[6]],
            direccion: data[keysData[7]],
          };
          usersDB.push(user);
        });
      } catch (error) {
        Swal.fire({
          title: 'Error al cargar el archivo, verifique el formato para la carga',
          icon: 'error',
        });
      }
      // this.funcionariosService.agregar_multiples_funcionarios(usersDB).subscribe(funcionarios => {
      //   this.mostrar_funcionarios()
      // })
    };
  }
  applyFilter() {
    if (this.text === '') return;
    this.paginatorService.offset = 0;
    this.getData();
  }
  cancelSearch() {
    this.paginatorService.offset = 0;
    this.text = '';
    this.getData();
  }
}
