import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationChartComponent } from '../shared/organization-chart/organization-chart.component';
import { CuentasComponent } from './pages/cuentas/cuentas.component';
import { DependenciasComponent } from './pages/dependencias/dependencias.component';
import { FuncionariosComponent } from './pages/funcionarios/funcionarios.component';
import { GroupwareComponent } from './pages/groupware/groupware.component';
import { InstitucionesComponent } from './pages/instituciones/instituciones.component';
import { TiposTramitesComponent } from './pages/tipos-tramites/tipos-tramites.component';
import { RolesComponent } from './pages/roles/roles.component';
import { RoleGuard } from '../guards/role.guard';
import { CargosComponent } from './pages/cargos/cargos.component';
import { OrganizationComponent } from './pages/organization/organization.component';


const routes: Routes = [
  { path: 'instituciones', component: InstitucionesComponent, canActivate: [RoleGuard], data: { resource: 'instituciones' } },
  { path: 'funcionarios', component: FuncionariosComponent, canActivate: [RoleGuard], data: { resource: 'usuarios' } },
  { path: 'dependencias', component: DependenciasComponent, canActivate: [RoleGuard], data: { resource: 'dependencias' } },
  { path: 'cuentas', component: CuentasComponent, canActivate: [RoleGuard], data: { resource: 'cuentas' } },
  { path: 'tipos', component: TiposTramitesComponent, canActivate: [RoleGuard], data: { resource: 'tipos' } },
  { path: 'roles', component: RolesComponent, canActivate: [RoleGuard], data: { resource: 'roles' } },
  { path: 'organigrama', component: OrganizationComponent, canActivate: [RoleGuard], data: { resource: 'cargos' } },
  { path: 'cargos', component: CargosComponent, canActivate: [RoleGuard], data: { resource: 'cargos' } },
  { path: 'groupware', component: GroupwareComponent },
  { path: 'organigrama', component: OrganizationChartComponent },
];



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ConfiguracionesRoutingModule { }
