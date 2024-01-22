import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { DependenciasComponent } from './pages/dependencias/dependencias.component';
import { OfficersComponent } from './pages/officers/officers.component';
import { GroupwareComponent } from './pages/groupware/groupware.component';
import { InstitucionesComponent } from './pages/instituciones/instituciones.component';
import { TiposTramitesComponent } from './pages/tipos-tramites/tipos-tramites.component';
import { RolesComponent } from './pages/roles/roles.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { OrganizationComponent } from './pages/organization/organization.component';

const routes: Routes = [
  {
    path: 'instituciones',
    component: InstitucionesComponent,
    data: { resource: 'institutions' },
  },
  {
    path: 'funcionarios',
    component: OfficersComponent,
    data: { resource: 'officers' },
  },
  {
    path: 'dependencias',
    component: DependenciasComponent,
    data: { resource: 'dependences' },
  },
  {
    path: 'cuentas',
    component: AccountsComponent,
    data: { resource: 'accounts' },
  },
  {
    path: 'tipos',
    component: TiposTramitesComponent,
    data: { resource: 'types-procedures' },
  },
  {
    path: 'roles',
    component: RolesComponent,
    data: { resource: 'roles' },
  },
  {
    path: 'organigrama',
    component: OrganizationComponent,
    data: { resource: 'jobs' },
  },
  {
    path: 'cargos',
    component: JobsComponent,
    data: { resource: 'jobs' },
  },
  { path: 'groupware', component: GroupwareComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class AdministrationRoutingModule {}
