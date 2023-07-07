import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../angular-material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DependenciasComponent } from './pages/dependencias/dependencias.component';
import { InstitucionesComponent } from './pages/instituciones/instituciones.component';
import { InstitucionDialogComponent } from './pages/instituciones/institucion-dialog/institucion-dialog.component';
import { DependenciaDialogComponent } from './pages/dependencias/dependencia-dialog/dependencia-dialog.component';
import { OfficerDialogComponent } from './dialogs/officer-dialog/officer-dialog.component';
import { CuentasComponent } from './pages/cuentas/cuentas.component';
import { CuentaDialogComponent } from './dialogs/cuenta-dialog/cuenta-dialog.component';
import { FuncionariosComponent } from './pages/funcionarios/funcionarios.component';
import { GroupwareComponent } from './pages/groupware/groupware.component';
import { CreacionAsignacionComponent } from './dialogs/creacion-asignacion/creacion-asignacion.component';
import { DetallesMovilidadComponent } from './pages/funcionarios/detalles-movilidad/detalles-movilidad.component';
import { EdicionCuentaComponent } from './dialogs/edicion-cuenta/edicion-cuenta.component';
import { TiposTramitesComponent } from './pages/tipos-tramites/tipos-tramites.component';
import { RolesComponent } from './pages/roles/roles.component';
import { RolDialogComponent } from './dialogs/rol-dialog/rol-dialog.component';
import { CargosComponent } from './pages/cargos/cargos.component';
import { OrganizationComponent } from './pages/organization/organization.component';
import { JobDialogComponent } from './dialogs/job-dialog/job-dialog.component';
import { WorkHistoryComponent } from './dialogs/work-history/work-history.component';
import { TypeProcedureDialogComponent } from './dialogs/type-procedure-dialog/type-procedure-dialog.component';



@NgModule({
  declarations: [
    DependenciasComponent,
    InstitucionesComponent,
    InstitucionDialogComponent,
    DependenciaDialogComponent,
    OfficerDialogComponent,
    CuentasComponent,
    CuentaDialogComponent,
    TiposTramitesComponent,
    FuncionariosComponent,
    GroupwareComponent,
    CreacionAsignacionComponent,
    DetallesMovilidadComponent,
    EdicionCuentaComponent,
    RolesComponent,
    RolDialogComponent,
    CargosComponent,
    OrganizationComponent,
    JobDialogComponent,
    WorkHistoryComponent,
    TypeProcedureDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    SharedModule,
    NgxMatSelectSearchModule,

  ]
})
export class ConfiguracionesModule { }
