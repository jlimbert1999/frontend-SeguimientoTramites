import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { read, utils } from 'xlsx';
import Swal from 'sweetalert2';
import { TiposTramitesService } from '../../services/tipos-tramites.service';
import { groupTypeProcedure, requirement, typeProcedure } from '../../interfaces/typeProcedure.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
interface elementTable {
  value: string
}

@Component({
  selector: 'app-type-procedure-dialog',
  templateUrl: './type-procedure-dialog.component.html',
  styleUrls: ['./type-procedure-dialog.component.scss']
})
export class TypeProcedureDialogComponent implements AfterViewInit {
  Form_TipoTramite: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    segmento: ['', Validators.required],
    tipo: ['', Validators.required]
  });
  segments: string[] = []
  requeriments: string[] = []
  filteredSegments: Observable<string[]>;
  displayedColumns: string[] = ['name', 'options'];
  dataSource: MatTableDataSource<requirement> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: typeProcedure,
    public dialogRef: MatDialogRef<TypeProcedureDialogComponent>,
    private tiposTramitesService: TiposTramitesService
  ) { }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }



  ngOnInit(): void {
    this.tiposTramitesService.getSegments().subscribe(segments => {
      this.segments = segments
      this.filteredSegments = this.Form_TipoTramite.get('segmento')!.valueChanges.pipe(
        startWith(''),
        map(value => this.filterSegments(value || '')),
      );
    })
    if (this.data) {
      this.Form_TipoTramite.removeControl('tipo')
      this.Form_TipoTramite.patchValue(this.data);
    }
  }



  save() {
    if (this.data) {
      this.tiposTramitesService.edit(this.data._id, this.Form_TipoTramite.value).subscribe(typeProcedure => {
        this.dialogRef.close(typeProcedure)
      })
    } else {
      // this.tiposTramitesService
      //   .agregar_tipoTramite(this.Form_TipoTramite.value, this.dataSource.data)
      //   .subscribe((tipo) => {
      //     this.dialogRef.close(tipo);
      //   });
    }
  }


  async loadExcelFile() {
    const { value: file } = await Swal.fire({
      title: 'Seleccione un archivo :ods, csv, xlsx',
      imageWidth: 500,
      imageHeight: 200,
      input: 'file',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputAttributes: {
        'accept': '.ods, csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        'aria-label': 'Cargar archivo excel'
      }
    })
    if (file) {
      const reader = new FileReader()
      reader.readAsBinaryString(file)
      reader.onload = (e) => {
        const wb = read(reader.result, { type: 'binary', cellDates: true });
        const data = utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]]);
        data.forEach(element => {

        })
      }
    }
  }
  addRequeriment() {
    Swal.fire({
      icon: 'info',
      title: `Registro de requerimiento`,
      text: `Ingrese la descripcion del requerimiento`,
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Ingrese la descripcion del requerimiento'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (!result.value) return
        // const requeriment: requirement = {
        //   nombre: result.value,
        //   activo:
        // }
        // this.dataSource.data.push({ value: result.value })
        this.dataSource = new MatTableDataSource(this.dataSource.data)
        this.dataSource.paginator = this.paginator
      }
    })
  }
  editRequeriment(pos: number) {
    Swal.fire({
      icon: 'info',
      title: `Edicion de requerimiento`,
      text: `Ingrese la descripcion del requerimiento`,
      input: 'textarea',
      // inputValue: requerimiento.nombre,
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
  quitar_requerimiento(pos: number) {
    this.dataSource.data.splice(pos, 1)
    this.dataSource = new MatTableDataSource(this.dataSource.data)
    this.dataSource.paginator = this.paginator
  }

  selectGroupProcedure(group: groupTypeProcedure) {
    if (this.data) {

    }

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private filterSegments(value: string): string[] {
    if (value === '') return this.segments
    const filterValue = value.toLowerCase();
    return this.segments.filter(option => option.toLowerCase().includes(filterValue));
  }
}
