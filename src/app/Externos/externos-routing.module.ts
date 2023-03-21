import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternosComponent } from './externos.component';
import { FichaExternoComponent } from './pages/ficha-externo/ficha-externo.component';


const routes: Routes = [
  // EXTERNOS
  { path: '', component: ExternosComponent},
  { path: 'ficha/:id', component: FichaExternoComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ExternosRoutingModule { }
