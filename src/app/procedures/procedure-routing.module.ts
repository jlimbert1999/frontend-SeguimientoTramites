import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternosComponent } from './pages/internos/internos.component';
import { ExternosComponent } from './pages/externos/externos.component';
import { FichaComponent } from './pages/ficha/ficha.component';

const routes: Routes = [
  { path: 'internos', component: InternosComponent },
  { path: 'externos', component: ExternosComponent },
  { path: 'internos/:id', component: FichaComponent },
  { path: 'externos/:id', component: FichaComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class ProcedureRoutingModule {}
