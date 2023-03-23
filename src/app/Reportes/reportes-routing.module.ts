import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FichaExternoComponent } from '../Externos/pages/ficha-externo/ficha-externo.component';
import { FichaInternoComponent } from '../Internos/ficha-interno/ficha-interno.component';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { EstadisticoComponent } from './pages/estadistico/estadistico.component';
import { FichaComponent } from './pages/ficha/ficha.component';
import { SolicitanteComponent } from './pages/solicitante/solicitante.component';


const routes: Routes = [
  // EXTERNOS
  { path: 'ficha', component: FichaComponent },
  { path: 'busqueda', component: BusquedaComponent },
  { path: 'busqueda/ficha-externa/:id', component: FichaExternoComponent },
  { path: 'busqueda/ficha-interna/:id', component: FichaInternoComponent },
  { path: 'solicitante', component: SolicitanteComponent },
  { path: 'estadistico', component: EstadisticoComponent },

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
