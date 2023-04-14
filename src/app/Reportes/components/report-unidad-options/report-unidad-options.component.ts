import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReporteService } from '../../services/reporte.service';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
@Component({
  selector: 'app-report-unidad-options',
  templateUrl: './report-unidad-options.component.html',
  styleUrls: ['./report-unidad-options.component.css']
})
export class ReportUnidadOptionsComponent implements OnInit, OnDestroy {
  instituciones: any[] = []
  dependencias: any[] = []
  accounts: any[] = []

  public dependenciaCtrl: FormControl<any> = new FormControl<any>(null);
  public dependenciaFilterCtrl: FormControl<any> = new FormControl<string>('');
  public filteredDependencias: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  public accountCtrl: FormControl<any> = new FormControl<any>(null);
  public accountFilterCtrl: FormControl<any> = new FormControl<string>('');
  public filteredAccounts: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy2 = new Subject<void>();

  constructor(private reporteService: ReporteService) {

  }
  ngOnInit(): void {
    this.reporteService.getInstitucionesForReports().subscribe(data => {
      this.instituciones = data
    })
  }


  getDependenciasOfInstituciones(id_institucion: string) {
    this.reporteService.getDependenciasForReports(id_institucion).subscribe(dependencias => {
      this.dependencias = dependencias
      this.dependenciaCtrl.setValue(this.dependencias)
      this.filteredDependencias.next(this.dependencias.slice())
      this.dependenciaFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterDependencias();
        });
    })
  }
  getUsersOfDendencia(id_dependencia: string) {
    this.reporteService.getUsersForReports(id_dependencia).subscribe(accounts => {
      this.accounts=accounts
      this.accountCtrl.setValue(this.accounts)
      this.filteredAccounts.next(this.accounts.slice())
      this.accountFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy2))
        .subscribe(() => {
          this.filterAccounts();
        });
    })
  }

  protected filterDependencias() {
    if (!this.dependencias) {
      return;
    }
    let search = this.dependenciaFilterCtrl.value;
    if (!search) {
      this.filteredDependencias.next(this.dependencias.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredDependencias.next(
      this.dependencias.filter(dep => dep.nombre.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterAccounts() {
    if (!this.accounts) {
      return;
    }
    let search = this.accountFilterCtrl.value;
    if (!search) {
      this.filteredAccounts.next(this.accounts.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAccounts.next(
      this.accounts.filter(account => account.funcionario.fullname.toLowerCase().indexOf(search) > -1 || account.funcionario.cargo.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this._onDestroy2.next();
    this._onDestroy2.complete();
  }





}
