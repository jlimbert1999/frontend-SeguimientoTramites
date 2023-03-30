import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { read, writeFileXLSX, utils } from "xlsx";
import { elementAt, map, Observable, startWith } from 'rxjs';
import { TiposTramitesService } from 'src/app/Configuraciones/services/tipos-tramites.service';
import { TipoTramiteDto } from 'src/app/Configuraciones/models/tipoTramite.dto';
import { Requerimiento, TipoTramite } from 'src/app/Configuraciones/models/tipoTramite.interface';

@Component({
  selector: 'app-dialog-tipos',
  templateUrl: './dialog-tipos.component.html',
  styleUrls: ['./dialog-tipos.component.css'],
})
export class DialogTiposComponent implements OnInit, AfterViewInit {
  titulo: string;
  Form_TipoTramite: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    segmento: ['', Validators.required],
    tipo: ['', Validators.required]
  });


  displayedColumns = ['nombre', 'situacion', 'opciones'];
  dataSource: MatTableDataSource<Requerimiento> = new MatTableDataSource()
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults = false;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: TipoTramite,
    public dialogRef: MatDialogRef<DialogTiposComponent>,
    private tiposTramitesService: TiposTramitesService
  ) { }

  ngAfterViewInit(): void {
    if (this.data) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    if (this.data) {
      this.titulo = 'Edicion';
      this.Form_TipoTramite.patchValue(this.data);
      this.dataSource = new MatTableDataSource(this.data.requerimientos)
    } else {
      this.titulo = 'Registro';
    }

  }

  guardar() {
    if (this.Form_TipoTramite.valid) {
      if (this.data) {
        let data = this.Form_TipoTramite.value
        data['requerimientos'] = this.dataSource.data
        this.tiposTramitesService.edit(this.data.id_tipoTramite!, data).subscribe(tipoTramite => {
          this.dialogRef.close(tipoTramite)
        })
      } else {
        this.tiposTramitesService
          .agregar_tipoTramite(this.Form_TipoTramite.value, this.dataSource.data)
          .subscribe((tipo) => {
            this.dialogRef.close(tipo);
          });

      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  agregar_requerimiento() {
    Swal.fire({
      icon: 'info',
      title: `Registro de requerimiento`,
      text: `Ingrese la descripcion del requerimiento`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar el requerimiento'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataSource.data = [{ nombre: result.value!, activo: true }, ...this.dataSource.data]
        this.dataSource.paginator = this.paginator
      }
    })

  }
  async cargar_requerimientos() {
    const { value: file } = await Swal.fire({
      title: 'Seleccione el archivo',
      text: 'Formato columas: | Nombre |',
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
  quitar_requerimiento(requerimiento: Requerimiento, pos: number) {
    if (requerimiento._id) {
      this.tiposTramitesService.deleteRequirement(this.data.id_tipoTramite, requerimiento._id!).subscribe(data => {
        const indexFound = this.dataSource.data.findIndex(element => requerimiento._id === element._id)
        this.dataSource.data[indexFound] = data
        this.dataSource = new MatTableDataSource(this.dataSource.data)
        this.dataSource.paginator = this.paginator
      })
    }
    else {
      this.dataSource.data.splice(pos, 1)
      this.dataSource = new MatTableDataSource(this.dataSource.data)
      this.dataSource.paginator = this.paginator
    }
  }
  editar_requerimiento(requerimiento: Requerimiento) {
    Swal.fire({
      icon: 'info',
      title: `Edicion de requerimiento`,
      text: `Ingrese la descripcion del requerimiento`,
      input: 'textarea',
      inputValue: requerimiento.nombre,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Debe ingresar el requerimiento'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.tiposTramitesService.editRequirement(this.data.id_tipoTramite, requerimiento._id!, result.value!).subscribe(data => {
          const indexFound = this.dataSource.data.findIndex(element => requerimiento._id === element._id)
          this.dataSource.data[indexFound] = data
          this.dataSource = new MatTableDataSource(this.dataSource.data)
          this.dataSource.paginator = this.paginator
        })
      }
    })
  }


  ReadExcel(File: File) {
    // let file = event.target.files[0]
    let fileReader = new FileReader()
    fileReader.readAsBinaryString(File)
    fileReader.onload = (e) => {
      let listRequeriments = read(fileReader.result, { type: 'binary' })
      let schemasNames = listRequeriments.SheetNames
      let ExcelData = utils.sheet_to_json(listRequeriments.Sheets[schemasNames[0]])
      let keysData
      ExcelData.forEach((data: any) => {
        keysData = Object.keys(data)
        this.dataSource.data.push({ nombre: data[keysData[0]], activo: true })
      });
      this.dataSource = new MatTableDataSource(this.dataSource.data)
      this.dataSource.paginator = this.paginator;
    }

  }

}
