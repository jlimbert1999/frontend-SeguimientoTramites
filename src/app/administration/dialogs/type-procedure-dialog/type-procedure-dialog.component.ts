import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { read, utils } from 'xlsx';
import Swal from 'sweetalert2';
import { TiposTramitesService } from '../../services/tipos-tramites.service';
import { groupTypeProcedure, requirement, typeProcedure } from '../../interfaces/typeProcedure.interface';
import { CreateTypeProcedureDto, UpdateTypeProcedureDto } from '../../dto/typeProcedure.dto';

@Component({
  selector: 'app-type-procedure-dialog',
  templateUrl: './type-procedure-dialog.component.html',
  styleUrls: ['./type-procedure-dialog.component.scss']
})
export class TypeProcedureDialogComponent {
  Form_TipoTramite: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    segmento: ['', Validators.required],
    tipo: ['', Validators.required]
  });
  segments: string[] = []
  filteredSegments: Observable<string[]>;
  dataSource: requirement[] = []
  denieRequirements: boolean

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: typeProcedure,
    public dialogRef: MatDialogRef<TypeProcedureDialogComponent>,
    private tiposTramitesService: TiposTramitesService
  ) {
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
      this.dataSource = this.data.requerimientos
    }
  }



  save() {
    if (this.data) {
      const typeProcedure = UpdateTypeProcedureDto.typeProdecureFromJson(this.Form_TipoTramite.value, this.dataSource)
      this.tiposTramitesService.edit(this.data._id, typeProcedure).subscribe(typeProcedure => {
        this.dialogRef.close(typeProcedure)
      })
    } else {
      const typeProcedure = CreateTypeProcedureDto.typeProdecureFromJson(this.Form_TipoTramite.value, this.dataSource)
      this.tiposTramitesService.add(typeProcedure).subscribe(typeProcedure => {
        this.dialogRef.close(typeProcedure)
      })
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
        this.dataSource.unshift({ nombre: result.value, activo: true })
      }
    })
  }
  editRequeriment(position: number, requeriment: requirement) {
    Swal.fire({
      icon: 'info',
      title: `Edicion de requerimiento`,
      text: `Ingrese la descripcion del requerimiento`,
      input: 'textarea',
      inputValue: requeriment.nombre,
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
        if (!result.value) return
        this.dataSource = [...this.dataSource]
        const { nombre, ...values } = this.dataSource[position]
        this.dataSource[position] = { nombre: result.value, ...values }
      }
    })
  }

  deleteRequiremet(position: number,) {
    this.dataSource = [...this.dataSource]
    const { activo, ...values } = this.dataSource[position]
    this.dataSource[position] = { activo: !activo, ...values }

  }
  removeRequeriment(position: number) {
    this.dataSource = [...this.dataSource]
    this.dataSource.splice(position, 1)
  }

  selectGroupProcedure(group: groupTypeProcedure) {
    if (group === 'INTERNO') {
      this.denieRequirements = true
      this.dataSource = []
    }
    else {
      this.denieRequirements = false
    }
  }


  private filterSegments(value: string): string[] {
    if (value === '') return this.segments
    const filterValue = value.toLowerCase();
    return this.segments.filter(option => option.toLowerCase().includes(filterValue));
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
        this.loadRequeriments(data)
      }
    }
  }
  loadRequeriments(data: any[]) {
    data.forEach(element => {
      if (element['NOMBRE']) {
        this.dataSource.unshift({
          nombre: element['NOMBRE'],
          activo: true
        })
      }
    })
  }
}
