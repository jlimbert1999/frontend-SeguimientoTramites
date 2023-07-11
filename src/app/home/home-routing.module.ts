import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { AuthGuard } from '../guards/auth.guard';
import { HomeComponent } from './home.component';
import { BusquedaComponent } from '../Reportes/pages/busqueda/busqueda.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RecursosComponent } from './pages/recursos/recursos.component';
import { NotificacionsComponent } from './pages/notificacions/notificacions.component';

const routes: Routes = [
    {
        path: 'home', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            {
                path: 'configuraciones',
                loadChildren: () =>
                    import(`../administration/administration-routing.module`).then((m) => m.AdministrationRoutingModule),
            },
            {
                path: 'tramites',
                loadChildren: () =>
                    import(`../Tramites/tramites-routing.module`).then((m) => m.TramitesRoutingModule),
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
            {
                path: 'busquedas',
                component: BusquedaComponent
            },
            {
                path: 'perfil/:id_account',
                component: PerfilComponent
            },
            {
                path: 'recursos',
                component: RecursosComponent
            },
            {
                path: 'notifications',
                component: NotificacionsComponent
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
