import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PresentationComponent } from './pages/presentation/presentation.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: PresentationComponent },
      {
        path: 'configuraciones',
        loadChildren: () =>
          import(`./administration/administration.module`).then(
            (m) => m.AdministrationModule
          ),
      },
      {
        path: 'tramites',
        loadChildren: () =>
          import(`./procedures/procedure.module`).then(
            (m) => m.ProcedureModule
          ),
      },
      {
        path: 'bandejas',
        loadChildren: () =>
          import(`./communication/communication.module`).then(
            (m) => m.CommunicationModule
          ),
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
