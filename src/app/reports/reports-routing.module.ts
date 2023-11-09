import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickSearchComponent } from './pages/quick-search/quick-search.component';
import { DetailComponent } from '../procedures/pages/detail/detail.component';

const routes: Routes = [
  { path: 'busqueda', component: QuickSearchComponent },
  { path: 'busqueda/:group/:id', component: DetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
