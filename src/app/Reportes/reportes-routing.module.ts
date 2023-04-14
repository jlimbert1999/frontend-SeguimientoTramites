import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './pages/menu/menu.component';
import { path } from 'd3';
import { ReporteFichaComponent } from './reporte-ficha/reporte-ficha.component';


const routes: Routes = [
  {
    path: '', component: MenuComponent
  },
];

@NgModule({
  declarations: [

  ],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ReportesRoutingModule {

}
