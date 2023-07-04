import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { read, utils } from 'xlsx';
import Swal from 'sweetalert2';
import { TiposTramitesService } from '../../services/tipos-tramites.service';
import { requirement, typeProcedure } from '../../interfaces/typeProcedure.interface';

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
    requerimientos: this.fb.array<requirement>([])
  });
  segments: string[] = []
  filteredSegments: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: typeProcedure,
    public dialogRef: MatDialogRef<TypeProcedureDialogComponent>,
    private tiposTramitesService: TiposTramitesService
  ) { }



  ngOnInit(): void {
    this.tiposTramitesService.getSegments().subscribe(segments => {
      this.segments = segments
      this.filteredSegments = this.Form_TipoTramite.get('segmento')!.valueChanges.pipe(
        startWith(''),
        map(value => this.filterSegments(value || '')),
      );
    })
    if (this.data) {
      this.data.requerimientos.forEach(element => {
        const requerimentForm = this.fb.group({
          nombre: [element.nombre, Validators.required],
          activo: [element.activo]
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
    // if (this.Form_TipoTramite.valid) {
    //   if (this.data) {
    //     let data = this.Form_TipoTramite.value
    //     this.tiposTramitesService.edit(this.data._id, data).subscribe(tipoTramite => {
    //       this.dialogRef.close(tipoTramite)
    //     })
    //   } else {
    //     // this.tiposTramitesService
    //     //   .agregar_tipoTramite(this.Form_TipoTramite.value, this.dataSource.data)
    //     //   .subscribe((tipo) => {
    //     //     this.dialogRef.close(tipo);
    //     //   });

    //   }
    // }
  }
  addRequeriment() {
    const requerimentForm = this.fb.group({
      nombre: ['', Validators.required],
      activo: [true]
    });
    this.requeriments.insert(0, requerimentForm);
  }
  removeRequeriment(position: number) {
    if (!this.data) {
      this.requeriments.removeAt(position)
    } else {
      const { nombre, activo } = this.requeriments.at(position).value
      this.requeriments.controls[position].setValue({ nombre, activo: !activo })
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
          if (element['REQUERIMIENTOS']) {
            const requerimentForm = this.fb.group({
              nombre: [element['REQUERIMIENTOS'], Validators.required],
              activo: [true]
            });
            this.requeriments.insert(0, requerimentForm);
          }
        })
      }
    }
  }

  private filterSegments(value: string): string[] {
    if (value === '') return this.segments
    const filterValue = value.toLowerCase();
    return this.segments.filter(option => option.toLowerCase().includes(filterValue));
  }

  selectGroupOfTypesProcedure(group: string) {
    this.requeriments.setValue([])
    if (this.data) {
      this.data.requerimientos.forEach(element => {
        const requerimentForm = this.fb.group({
          nombre: [element.nombre, Validators.required],
          activo: [element.activo]
        });
        this.requeriments.push(requerimentForm)
      })
    }
  }

}
