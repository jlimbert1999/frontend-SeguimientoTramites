import { Component, Inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Requerimiento, TipoTramite } from '../../models/tipoTramite.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { read, utils } from 'xlsx';
import { TiposTramitesService } from '../../services/tipos-tramites.service';
import { requirement, typeProcedure } from '../../interfaces/typeProcedure.interface';
import { privilege } from '../../interfaces/role.interface';

@Component({
  selector: 'app-type-procedure-dialog',
  templateUrl: './type-procedure-dialog.component.html',
  styleUrls: ['./type-procedure-dialog.component.scss']
})
export class TypeProcedureDialogComponent {
  Form_TipoTramite: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    segmento: ['', Validators.required],
    tipo: ['', Validators.required],
    requerimientos: this.fb.array<privilege>([])
  });


  displayedColumns = ['nombre', 'situacion', 'options'];
  dataSource: MatTableDataSource<requirement> = new MatTableDataSource()

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: typeProcedure,
    public dialogRef: MatDialogRef<TypeProcedureDialogComponent>,
    private tiposTramitesService: TiposTramitesService
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    if (this.data) {
      this.data.requerimientos.forEach(element => {
        const requerimentForm = this.fb.group({
          nombre: ['', Validators.required],
          activo: [true]
        });
        this.requeriments.push(requerimentForm)
      })
      this.Form_TipoTramite.patchValue(this.data);


    }

  }

  get requeriments() {
    return this.Form_TipoTramite.controls["requerimientos"] as FormArray;
  }

  guardar() {
    if (this.Form_TipoTramite.valid) {
      if (this.data) {
        let data = this.Form_TipoTramite.value
        data['requerimientos'] = this.dataSource.data
        this.tiposTramitesService.edit(this.data._id, data).subscribe(tipoTramite => {
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
  addRequeriment() {
    const requerimentForm = this.fb.group({
      nombre: ['', Validators.required],
      activo: [true]
    });
    this.requeriments.insert(0, requerimentForm);
    this.dataSource.data = [...this.Form_TipoTramite.get('requerimientos')?.value]
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
        // this.dataSource.data = [{ nombre: result.value!, activo: true }, ...this.dataSource.data]

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
    // if (requerimiento._id) {
    //   this.tiposTramitesService.deleteRequirement(this.data.id_tipoTramite, requerimiento._id!).subscribe(data => {
    //     const indexFound = this.dataSource.data.findIndex(element => requerimiento._id === element._id)
    //     this.dataSource.data[indexFound] = data
    //     this.dataSource = new MatTableDataSource(this.dataSource.data)
    //     this.dataSource.paginator = this.paginator
    //   })
    // }
    // else {
    //   this.dataSource.data.splice(pos, 1)
    //   this.dataSource = new MatTableDataSource(this.dataSource.data)
    //   this.dataSource.paginator = this.paginator
    // }
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
        // this.tiposTramitesService.editRequirement(this.data.id_tipoTramite, requerimiento._id!, result.value!).subscribe(data => {
        //   const indexFound = this.dataSource.data.findIndex(element => requerimiento._id === element._id)
        //   this.dataSource.data[indexFound] = data
        //   this.dataSource = new MatTableDataSource(this.dataSource.data)
        //   this.dataSource.paginator = this.paginator
        // })
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
        // this.dataSource.data.push({ nombre: data[keysData[0]], activo: true })
      });
      this.dataSource = new MatTableDataSource(this.dataSource.data)
    }

  }
}
