import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { FichaComponent } from './pages/ficha/ficha.component';


const routes: Routes = [
  // EXTERNOS
  { path: 'ficha', component: FichaComponent },
  { path: 'busqueda', component: BusquedaComponent },
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
