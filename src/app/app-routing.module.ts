import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutingModule } from './home/home-routing.module';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  // { path: '', redirectTo: '/home/main', pathMatch: 'full' },
  {
    path: 'home/configuraciones',
    loadChildren: () =>
      import(`./administration/administration-routing.module`).then((m) => m.AdministrationRoutingModule),
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/home/configuraciones' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
