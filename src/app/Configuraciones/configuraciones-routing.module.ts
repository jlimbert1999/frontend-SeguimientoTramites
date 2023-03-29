import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuentaComponent } from './pages/cuenta/cuenta.component';
import { CuentasComponent } from './pages/cuentas/cuentas.component';
import { DependenciasComponent } from './pages/dependencias/dependencias.component';
import { FuncionariosComponent } from './pages/funcionarios/funcionarios.component';
import { GroupwareComponent } from './pages/groupware/groupware.component';
import { InstitucionesComponent } from './pages/instituciones/instituciones.component';
import { TiposTramitesComponent } from './pages/tipos-tramites/tipos-tramites.component';


const routes: Routes = [
  // EXTERNOS
  { path: 'instituciones', component: InstitucionesComponent },
  { path: 'funcionarios', component: FuncionariosComponent },
  { path: 'dependencias', component: DependenciasComponent },
  { path: 'cuentas', component: CuentasComponent },
  { path: 'groupware', component: GroupwareComponent },
  { path: 'tipos', component: TiposTramitesComponent },
  { path: 'perfil', component: CuentaComponent },
];



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ConfiguracionesRoutingModule { }
