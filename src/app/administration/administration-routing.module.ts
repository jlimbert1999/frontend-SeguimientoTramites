import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { RoleGuard } from '../guards/role.guard';
import { DependenciasComponent } from './pages/dependencias/dependencias.component';
import { OfficersComponent } from './pages/officers/officers.component';
import { GroupwareComponent } from './pages/groupware/groupware.component';
import { InstitucionesComponent } from './pages/instituciones/instituciones.component';
import { TiposTramitesComponent } from './pages/tipos-tramites/tipos-tramites.component';
import { RolesComponent } from './pages/roles/roles.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { OrganizationComponent } from './pages/organization/organization.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  {
    path: 'instituciones',
    component: InstitucionesComponent,
    canActivate: [RoleGuard],
    data: { resource: 'institutions' },
  },
  {
    path: 'funcionarios',
    component: OfficersComponent,
    canActivate: [RoleGuard],
    data: { resource: 'officers' },
  },
  {
    path: 'dependencias',
    component: DependenciasComponent,
    canActivate: [RoleGuard],
    data: { resource: 'dependences' },
  },
  {
    path: 'cuentas',
    component: AccountsComponent,
    canActivate: [RoleGuard],
    data: { resource: 'accounts' },
  },
  {
    path: 'tipos',
    component: TiposTramitesComponent,
    canActivate: [RoleGuard],
    data: { resource: 'types-procedures' },
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [RoleGuard],
    data: { resource: 'roles' },
  },
  {
    path: 'organigrama',
    component: OrganizationComponent,
    canActivate: [RoleGuard],
    data: { resource: 'jobs' },
  },
  {
    path: 'cargos',
    component: JobsComponent,
    canActivate: [RoleGuard],
    data: { resource: 'jobs' },
  },
  { path: 'groupware', component: GroupwareComponent },
  { path: 'sistema', component: SettingsComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class AdministrationRoutingModule {}
