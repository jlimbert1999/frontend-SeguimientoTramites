import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { DependenciasComponent } from './pages/dependencias/dependencias.component';
import { InstitucionesComponent } from './pages/instituciones/instituciones.component';
import { InstitutionDialogComponent } from './dialogs/institution-dialog/institution-dialog.component';
import { DependenciaDialogComponent } from './pages/dependencias/dependencia-dialog/dependencia-dialog.component';
import { OfficerDialogComponent } from './dialogs/officer-dialog/officer-dialog.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { CuentaDialogComponent } from './dialogs/cuenta-dialog/cuenta-dialog.component';
import { OfficersComponent } from './pages/officers/officers.component';
import { GroupwareComponent } from './pages/groupware/groupware.component';
import { CreacionAsignacionComponent } from './dialogs/creacion-asignacion/creacion-asignacion.component';
import { EditAccountDialogComponent } from './dialogs/edit-account-dialog/edit-account-dialog.component';
import { TiposTramitesComponent } from './pages/tipos-tramites/tipos-tramites.component';
import { RolesComponent } from './pages/roles/roles.component';
import { RolDialogComponent } from './dialogs/rol-dialog/rol-dialog.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { OrganizationComponent } from './pages/organization/organization.component';
import { JobDialogComponent } from './dialogs/job-dialog/job-dialog.component';
import { WorkHistoryComponent } from './dialogs/work-history/work-history.component';
import { TypeProcedureDialogComponent } from './dialogs/type-procedure-dialog/type-procedure-dialog.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AdministrationRoutingModule } from './administration-routing.module';
import { FilterUsersSocketPipe } from './pipes/filter-users-socket.pipe';

@NgModule({
  declarations: [
    DependenciasComponent,
    InstitucionesComponent,
    InstitutionDialogComponent,
    DependenciaDialogComponent,
    OfficerDialogComponent,
    AccountsComponent,
    CuentaDialogComponent,
    TiposTramitesComponent,
    OfficersComponent,
    GroupwareComponent,
    CreacionAsignacionComponent,
    EditAccountDialogComponent,
    RolesComponent,
    RolDialogComponent,
    JobsComponent,
    OrganizationComponent,
    JobDialogComponent,
    WorkHistoryComponent,
    TypeProcedureDialogComponent,
    SettingsComponent,
    FilterUsersSocketPipe
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    SharedModule,
    NgxMatSelectSearchModule,
  ]
})
export class AdministrationModule { }
