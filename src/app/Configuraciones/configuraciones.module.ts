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
import { UsuarioDialogComponent } from './pages/cuentas/usuario-dialog/usuario-dialog.component';
import { CuentasComponent } from './pages/cuentas/cuentas.component';
import { CuentaDialogComponent } from './pages/cuentas/cuenta-dialog/cuenta-dialog.component';
import { FuncionariosComponent } from './pages/funcionarios/funcionarios.component';
import { GroupwareComponent } from './pages/groupware/groupware.component';
import { CuentaComponent } from './pages/cuenta/cuenta.component';
import { CreacionAsignacionComponent } from './pages/cuentas/creacion-asignacion/creacion-asignacion.component';
import { DetallesMovilidadComponent } from './pages/funcionarios/detalles-movilidad/detalles-movilidad.component';
import { EdicionCuentaComponent } from './pages/cuentas/edicion-cuenta/edicion-cuenta.component';
import { TiposTramitesComponent } from './pages/tipos-tramites/tipos-tramites.component';
import { DialogTiposComponent } from './pages/tipos-tramites/dialog-tipos/dialog-tipos.component';
import { RolesComponent } from './pages/roles/roles.component';
import { RolDialogComponent } from './dialogs/rol-dialog/rol-dialog.component';



@NgModule({
  declarations: [
    DependenciasComponent,
    InstitucionesComponent,
    InstitucionDialogComponent,
    DependenciaDialogComponent,
    UsuarioDialogComponent,
    CuentasComponent,
    CuentaDialogComponent,
    TiposTramitesComponent,
    DialogTiposComponent,
    FuncionariosComponent,
    GroupwareComponent,
    CreacionAsignacionComponent,
    DetallesMovilidadComponent,
    CuentaComponent,
    EdicionCuentaComponent,
    RolesComponent,
    RolDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    SharedModule,
    NgxMatSelectSearchModule
  ]
})
export class ConfiguracionesModule { }
