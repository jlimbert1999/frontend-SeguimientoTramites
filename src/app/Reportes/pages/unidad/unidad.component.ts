import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DependenciasService } from 'src/app/Configuraciones/services/dependencias.service';
import { ReporteService } from '../../services/reporte.service';
import { UntypedFormControl } from '@angular/forms';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.css']
})
export class UnidadComponent {
  instituciones: any[] = []
  dependencias: any[] = []
  public bankCtrl: UntypedFormControl = new UntypedFormControl();
  public bankFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  constructor(private reporteService: ReporteService) {
    this.reporteService.getInstitucionesForReports().subscribe(data => {
      this.instituciones = data
    })
  }


  getDependenciasOfInstituciones(id_institucion: string) {
    this.reporteService.getDependenciasForReports(id_institucion).subscribe(deps => {
      this.dependencias = deps
      this.bankCtrl.setValue(this.dependencias);
      this.filteredBanks.next(this.dependencias.slice());
      this.bankFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterBanks();
        });
    })

  }

  protected filterBanks() {
    if (!this.dependencias) {
      return;
    }
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.dependencias.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanks.next(
      this.dependencias.filter(bank => bank.nombre.toLowerCase().indexOf(search) > -1)
    );
  }

}
