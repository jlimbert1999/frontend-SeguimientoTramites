import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternosComponent } from './internos.component';
import { FichaInternoComponent } from './ficha-interno/ficha-interno.component';


const routes: Routes = [
  // EXTERNOS
  { path: '', component: InternosComponent },
  // { path: 'tramites-externos-concluidos', component: ConcluidosComponent },
  { path: 'ficha/:id', component: FichaInternoComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class InternosRoutingModule { }
