import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PresentationComponent } from './pages/presentation/presentation.component';
import { ResourcesComponent } from './pages/resources/resources.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: PresentationComponent },
      { path: 'recursos', component: ResourcesComponent },
      {
        path: 'configuraciones',
        loadChildren: () => import(`./administration/administration.module`).then((m) => m.AdministrationModule),
      },
      {
        path: 'tramites',
        loadChildren: () => import(`./procedures/procedure.module`).then((m) => m.ProcedureModule),
      },
      {
        path: 'bandejas',
        loadChildren: () => import(`./communication/communication.module`).then((m) => m.CommunicationModule),
      },
      {
        path: 'reportes',
        loadChildren: () => import(`./reports/reports.module`).then((m) => m.ReportsModule),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableViewTransitions: true,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
