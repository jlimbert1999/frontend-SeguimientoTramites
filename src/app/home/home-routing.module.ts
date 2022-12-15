import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
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
import { ExternosComponent } from '../Tramites/externos/externos.component';
import { FichaComponent } from '../Tramites/ficha/ficha.component';
import { InternosComponent } from '../Tramites/internos/internos.component';
import { MailFichaComponent } from '../Tramites/mail-ficha/mail-ficha.component';
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

            { path: 'tramites-externos', component: ExternosComponent },
            { path: 'tramites-externos/ficha/:id', component: FichaComponent },

            { path: 'tramites-internos', component: InternosComponent },

            { path: 'bandeja-entrada', component: BandejaEntradaComponent },
            { path: 'bandeja-entrada/mail-ficha/:id', component: MailFichaComponent },

            { path: 'bandeja-salida', component: BandejaSalidaComponent },
            { path: 'bandeja-salida/ficha/:id', component: FichaComponent },

            // REPORTES
            { path: 'reporte-ficha', component: ReporteFichaComponent },
            { path: 'reporte-estado', component: ReporteEstadoComponent },
            { path: 'reporte-tipo', component: ReporteTipoComponent },
            { path: 'reporte-contribuyente', component: ReporteContribuyenteComponent },

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
