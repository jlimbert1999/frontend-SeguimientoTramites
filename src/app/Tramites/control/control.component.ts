import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TramiteService } from '../services/tramite.service';
import * as XLSX from 'xlsx';
import { reporte_tramites_realizados } from 'src/app/generacion_pdfs/reportes';
@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns = ['origen', 'fecha_creacion', 'alterno', 'ubicacion', 'objeto', 'tipo_contratacion', 'precio', 'empresa_adjudicada', 'representante_legal', 'precio_adjudicado', 'estado', 'observaciones', 'plazo', 'nro_apertura', 'modalidad', 'cuce']
  tipos_filtro: string[] = ['Modalidad', 'Origen', 'Ubicacion']
  filtro: string
  constructor(private tramiteService: TramiteService) { }

  ngOnInit(): void {
    this.obtener_tramites()
  }
  obtener_tramites() {
    this.tramiteService.obtener_control_tramites().subscribe(tramites => {
      this.dataSource = new MatTableDataSource(tramites)
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== '') {
      this.tramiteService.filtrar_tramites(this.filtro, filterValue).subscribe(tramites => {
        this.dataSource = new MatTableDataSource(tramites)
      })
    }

  }

  exportar_informacion(formato: 'pdf' | 'excel') {
    if (formato === 'excel') {
      /* table id is passed over here */
      let element = document.getElementById('excel-table');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, 'pruebaexcel.xlsx');
    }
    else if (formato === 'pdf') {
      reporte_tramites_realizados(this.displayedColumns, this.dataSource.data)
    }
  }


}
