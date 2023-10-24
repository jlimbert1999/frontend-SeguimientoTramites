import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './pages/menu/menu.component';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { ProcedureDetailComponent } from '../procedures/pages/procedure-detail/procedure-detail.component';



const routes: Routes = [
  {
    path: '', component: MenuComponent
  },
  {
    path: 'busquedas', component: BusquedaComponent
  },
  {
    path: 'busquedas/:tipo/:id', component: ProcedureDetailComponent
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
