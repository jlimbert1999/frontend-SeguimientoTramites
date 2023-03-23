import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteFichaComponent } from './reporte-ficha/reporte-ficha.component';
import { MaterialModule } from '../angular-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReporteSolicitanteComponent } from './reporte-solicitante/reporte-solicitante.component';
import { RouterModule } from '@angular/router';
import { ReporteContribuyenteComponent } from './reporte-contribuyente/reporte-contribuyente.component';
import { FichaComponent } from './pages/ficha/ficha.component';
import { SharedModule } from '../shared/shared.module';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { EstadisticoComponent } from './pages/estadistico/estadistico.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SolicitanteComponent } from './pages/solicitante/solicitante.component';




@NgModule({
  declarations: [
    ReporteFichaComponent,
    ReporteSolicitanteComponent,
    ReporteContribuyenteComponent,
    FichaComponent,
    BusquedaComponent,
    EstadisticoComponent,
    SolicitanteComponent,
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
    NgxChartsModule
  ]
})
export class ReportesModule { }
