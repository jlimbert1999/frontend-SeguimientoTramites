import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { CuentaComponent } from '../Configuraciones/cuenta/cuenta.component';
import { CuentasComponent } from '../Configuraciones/cuentas/cuentas.component';
import { DependenciasComponent } from '../Configuraciones/dependencias/dependencias.component';
import { FuncionariosComponent } from '../Configuraciones/funcionarios/funcionarios.component';
import { GroupwareComponent } from '../Configuraciones/groupware/groupware.component';
import { InstitucionesComponent } from '../Configuraciones/instituciones/instituciones.component';
import { TiposTramitesComponent } from '../Configuraciones/tipos-tramites/tipos-tramites.component';
import { AuthGuard } from '../guards/auth.guard';
import { HomeComponent } from './home.component';

const routes: Routes = [
    {
        path: 'home', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: 'dependencias', component: DependenciasComponent },
            { path: 'instituciones', component: InstitucionesComponent },
            { path: 'cuentas', component: CuentasComponent },
            { path: 'funcionarios', component: FuncionariosComponent },
            { path: 'groupware', component: GroupwareComponent },
            { path: 'tipos', component: TiposTramitesComponent },
            { path: 'perfil', component: CuentaComponent },
            {
                path: 'tramites-externos',
                loadChildren: () =>
                    import(`../Externos/externos-routing.module`).then((m) => m.ExternosRoutingModule),
            },
            {
                path: 'tramites-internos',
                loadChildren: () =>
                    import(`../Internos/internos-routing.module`).then((m) => m.InternosRoutingModule),
            },
            {
                path: 'archivos',
                loadChildren: () =>
                    import(`../Archivos/archivos-routing.module`).then((m) => m.ArchivosRoutingModule),
            },
            {
                path: 'reportes',
                loadChildren: () =>
                    import(`../Reportes/reportes-routing.module`).then((m) => m.ReportesRoutingModule),
            },
            {
                path: 'bandejas',
                loadChildren: () =>
                    import(`../Bandejas/bandejas-routing.module`).then((m) => m.BandejasRoutingModule),
            },
          
    
        ]
    },
    {
        path: 'login', component: LoginComponent,

    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
