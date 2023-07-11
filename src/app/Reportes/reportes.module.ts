import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../angular-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';

import { AdministrationModule } from '../administration/administration.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MenuComponent } from './pages/menu/menu.component';
import { ReportFichaOptionsComponent } from './components/report-ficha-options/report-ficha-options.component';
import { ReportUnidadOptionsComponent } from './components/report-unidad-options/report-unidad-options.component';
import { ReportSolicitanteOptionsComponent } from './components/report-solicitante-options/report-solicitante-options.component';
import { ReportTipoOptionsComponent } from './components/report-tipo-options/report-tipo-options.component';
import { ReportUsuarioOptionsComponent } from './components/report-usuario-options/report-usuario-options.component';

@NgModule({
  declarations: [
    BusquedaComponent,
    MenuComponent,
    ReportFichaOptionsComponent,
    ReportUnidadOptionsComponent,
    ReportSolicitanteOptionsComponent,
    ReportTipoOptionsComponent,
    ReportUsuarioOptionsComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    SharedModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    LayoutModule,
    AdministrationModule,
    NgxMatSelectSearchModule
  ],
  providers: [

  ]
})
export class ReportesModule { }
