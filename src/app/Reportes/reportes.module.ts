import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteFichaComponent } from './reporte-ficha/reporte-ficha.component';
import { MaterialModule } from '../angular-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReporteEstadoComponent } from './reporte-estado/reporte-estado.component';
import { ReporteTipoComponent } from './reporte-tipo/reporte-tipo.component';
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




@NgModule({
  declarations: [
    ReporteFichaComponent,
    ReporteEstadoComponent,
    ReporteTipoComponent,
    ReporteSolicitanteComponent,
    ReporteContribuyenteComponent,
    FichaComponent,
    BusquedaComponent,
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
    SharedModule
  ]
})
export class ReportesModule { }
