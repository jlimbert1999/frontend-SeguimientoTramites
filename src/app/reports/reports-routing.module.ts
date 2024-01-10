import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from '../procedures/pages/detail/detail.component';
import { SimpleSearchComponent } from './pages/simple-search/simple-search.component';
import { ApplicantComponent } from './pages/applicant/applicant.component';
import { AvancedSearchComponent } from './pages/avanced-search/avanced-search.component';
import { DependentsComponent } from './pages/dependents/dependents.component';
import { UnitComponent } from './pages/unit/unit.component';
import { DashboardTotalCommunicationsComponent } from './pages/dashboard-total-communications/dashboard-total-communications.component';
import { RankingUsersComponent } from './pages/ranking-users/ranking-users.component';
import { QuickSearchComponent } from './pages/quick-search/quick-search.component';

const routes: Routes = [
  { path: 'busqueda-simple', component: SimpleSearchComponent },
  { path: 'busqueda-avanzada', component: AvancedSearchComponent },
  { path: 'busqueda-rapida', component: QuickSearchComponent },
  { path: 'solicitante', component: ApplicantComponent },
  { path: 'dependientes', component: DependentsComponent },
  { path: 'unidad', component: UnitComponent },
  { path: 'total', component: DashboardTotalCommunicationsComponent },
  { path: 'ranking', component: RankingUsersComponent },
  { path: ':path/:group/:id', component: DetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
