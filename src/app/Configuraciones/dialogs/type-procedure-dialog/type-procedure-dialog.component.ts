import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { read, utils } from 'xlsx';
import Swal from 'sweetalert2';
import { TiposTramitesService } from '../../services/tipos-tramites.service';
import { typeProcedure } from '../../interfaces/typeProcedure.interface';

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
    requerimientos: this.fb.array<string[]>([])
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
      this.Form_TipoTramite.removeControl('tipo')
      this.data.requerimientos.forEach(element => {
        const requerimentForm = this.fb.group({
          nombre: [element, Validators.required]
        });
        this.requeriments.push(requerimentForm)
      })
      this.Form_TipoTramite.patchValue(this.data);
    }
  }

  get requeriments() {
    return this.Form_TipoTramite.controls["requerimientos"] as FormArray;
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
  addRequeriment() {
    const requerimentForm = this.fb.group({
      nombre: ['', Validators.required]
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
              nombre: [element['REQUERIMIENTOS'], Validators.required]
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
}
