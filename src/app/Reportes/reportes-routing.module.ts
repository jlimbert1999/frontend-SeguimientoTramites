import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { EstadisticoComponent } from './pages/estadistico/estadistico.component';
import { FichaComponent } from './pages/ficha/ficha.component';
import { SolicitanteComponent } from './pages/solicitante/solicitante.component';
import { UnidadComponent } from './pages/unidad/unidad.component';


const routes: Routes = [
  // EXTERNOS
  { path: 'ficha', component: FichaComponent },
  { path: 'busqueda', component: BusquedaComponent },
  { path: 'solicitante', component: SolicitanteComponent },
  { path: 'estadistico', component: EstadisticoComponent },
  { path: 'unidad', component: UnidadComponent },

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
