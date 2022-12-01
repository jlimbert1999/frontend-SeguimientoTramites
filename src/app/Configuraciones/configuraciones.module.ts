import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DependenciasComponent } from './dependencias/dependencias.component';
import { InstitucionesComponent } from './instituciones/instituciones.component';
import { InstitucionDialogComponent } from './instituciones/institucion-dialog/institucion-dialog.component';
import { MaterialModule } from '../angular-material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { DependenciaDialogComponent } from './dependencias/dependencia-dialog/dependencia-dialog.component';
import { UsuarioDialogComponent } from './cuentas/usuario-dialog/usuario-dialog.component';
import { CuentasComponent } from './cuentas/cuentas.component';
import { CuentaDialogComponent } from './cuentas/cuenta-dialog/cuenta-dialog.component';
import { TiposTramitesComponent } from './tipos-tramites/tipos-tramites.component';
import { DialogTiposComponent } from './tipos-tramites/dialog-tipos/dialog-tipos.component';
import { AsignacionDialogComponent } from './cuentas/asignacion-dialog/asignacion-dialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { GroupwareComponent } from './groupware/groupware.component';
import { CreacionAsignacionComponent } from './cuentas/creacion-asignacion/creacion-asignacion.component';
import { DetallesMovilidadComponent } from './funcionarios/detalles-movilidad/detalles-movilidad.component';



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
    AsignacionDialogComponent,
    FuncionariosComponent,
    GroupwareComponent,
    CreacionAsignacionComponent,
    DetallesMovilidadComponent
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
