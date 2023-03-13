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
import { ReporteContribuyenteComponent } from '../Reportes/reporte-contribuyente/reporte-contribuyente.component';
import { ReporteEstadoComponent } from '../Reportes/reporte-estado/reporte-estado.component';
import { ReporteFichaComponent } from '../Reportes/reporte-ficha/reporte-ficha.component';
import { ReporteSolicitanteComponent } from '../Reportes/reporte-solicitante/reporte-solicitante.component';
import { ReporteTipoComponent } from '../Reportes/reporte-tipo/reporte-tipo.component';
import { BandejaEntradaComponent } from '../Tramites/bandeja-entrada/bandeja-entrada.component';
import { BandejaSalidaComponent } from '../Tramites/bandeja-salida/bandeja-salida.component';
import { ControlComponent } from '../Tramites/control/control.component';
import { ConcluidosComponent } from '../Externos/concluidos/concluidos.component';
import { ExternosComponent } from '../Externos/externos.component';
import { MailFichaExternoComponent } from '../Externos/mail-ficha-externo/mail-ficha-externo.component';
import { FichaComponent } from '../Tramites/ficha/ficha.component';
import { FichaInternoComponent } from '../Internos/ficha-interno/ficha-interno.component';
import { InternosComponent } from '../Internos/internos.component';
import { MailFichaInternoComponent } from '../Internos/mail-ficha-interno/mail-ficha-interno.component';
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
            //   {
            //     path: 'module-two',
            //     loadChildren: () =>
            //       import(`./moduleTwo/module-two.module`).then((m) => m.ModuleTwoModule),
            //   },
            //   {
            //     path: 'module-three',
            //     loadChildren: () =>
            //       import(`./moduleThree/module-three.module`).then(
            //         (m) => m.ModuleThreeModule
            //       ),
            //   },
            //   { path: '', redirectTo: 'module-one', pathMatch: 'full' },

            // EXTERNOS
            // { path: 'tramites-externos', component: ExternosComponent },
            // { path: 'tramites-externos-concluidos', component: ConcluidosComponent },
            // { path: 'tramites-externos/ficha/:id', component: FichaExternoComponent },
            { path: 'bandeja-entrada/mail-ficha-externo/:id', component: MailFichaExternoComponent },
            // { path: 'bandeja-salida/ficha-externo/:id', component: FichaExternoComponent },

            // INTERNOS
            // { path: 'tramites-internos', component: InternosComponent },
            // { path: 'tramites-internos/ficha/:id', component: FichaInternoComponent },
            { path: 'bandeja-entrada/mail-ficha-interno/:id', component: MailFichaInternoComponent },
            { path: 'bandeja-salida/ficha-interno/:id', component: FichaInternoComponent },


            // BANDEJAS
            { path: 'bandeja-entrada', component: BandejaEntradaComponent },
            { path: 'bandeja-salida', component: BandejaSalidaComponent },



            // REPORTES
            // { path: 'reporte-ficha', component: ReporteFichaComponent },
            // { path: 'reporte-estado', component: ReporteEstadoComponent },
            // { path: 'reporte-tipo', component: ReporteTipoComponent },
            // { path: 'reporte-contribuyente', component: ReporteContribuyenteComponent },

            // REPORTES CON BUSQUEDAS
            { path: 'reporte-solicitante', component: ReporteSolicitanteComponent },
            { path: 'reporte-solicitante/ficha/:id', component: FichaComponent },

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
