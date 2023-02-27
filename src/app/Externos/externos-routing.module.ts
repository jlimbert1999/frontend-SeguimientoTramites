import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConcluidosComponent } from './concluidos/concluidos.component';
import { ExternosComponent } from './externos.component';
import { MailFichaExternoComponent } from './mail-ficha-externo/mail-ficha-externo.component';
import { FichaExternoComponent } from './pages/ficha-externo/ficha-externo.component';


const routes: Routes = [
  // EXTERNOS
  { path: '', component: ExternosComponent},
  { path: 'tramites-externos-concluidos', component: ConcluidosComponent },
  { path: 'ficha/:id', component: FichaExternoComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ExternosRoutingModule { }
