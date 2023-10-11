import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FichaComponent } from '../procedures/pages/ficha/ficha.component';
import { AdministrationComponent } from './pages/administration/administration.component';

const routes: Routes = [
  { path: 'archivos', component: AdministrationComponent },
  { path: 'tramite/:tipo/:id', component: FichaComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class ArchiveRoutingModule {}
