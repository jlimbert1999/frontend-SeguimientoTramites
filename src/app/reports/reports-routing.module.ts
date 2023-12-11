import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from '../procedures/pages/detail/detail.component';
import { QuickSearchComponent } from './pages/quick-search/quick-search.component';
import { ApplicantComponent } from './pages/applicant/applicant.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AvancedSearchComponent } from './pages/avanced-search/avanced-search.component';
import { DependentsComponent } from './pages/dependents/dependents.component';
import { UnitComponent } from './pages/unit/unit.component';
import { DashboardTotalCommunicationsComponent } from './pages/dashboard-total-communications/dashboard-total-communications.component';

const routes: Routes = [
  { path: 'busqueda', component: QuickSearchComponent },
  { path: 'solicitante', component: ApplicantComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'busqueda-avanzada', component: AvancedSearchComponent },
  { path: 'dependientes', component: DependentsComponent },
  { path: 'unidad', component: UnitComponent },
  { path: ':from/:group/:id', component: DetailComponent },
  { path: 'total', component: DashboardTotalCommunicationsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
