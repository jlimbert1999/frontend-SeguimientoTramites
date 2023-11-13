import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickSearchComponent } from './pages/quick-search/quick-search.component';
import { DetailComponent } from '../procedures/pages/detail/detail.component';
import { ApplicantComponent } from './pages/applicant/applicant.component';

const routes: Routes = [
  { path: 'busqueda', component: QuickSearchComponent },
  { path: 'solicitante', component: ApplicantComponent },
  { path: ':from/:group/:id', component: DetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
