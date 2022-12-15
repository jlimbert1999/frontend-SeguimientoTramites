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




@NgModule({
  declarations: [
    ReporteFichaComponent,
    ReporteEstadoComponent,
    ReporteTipoComponent,
    ReporteSolicitanteComponent,
    ReporteContribuyenteComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class ReportesModule { }
