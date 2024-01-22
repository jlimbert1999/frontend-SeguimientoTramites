import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from '../procedures/pages/detail/detail.component';
import { ApplicantComponent } from './pages/applicant/applicant.component';
import { DependentsComponent } from './pages/dependents/dependents.component';
import { UnitComponent } from './pages/unit/unit.component';
import { DashboardTotalCommunicationsComponent } from './pages/dashboard-total-communications/dashboard-total-communications.component';
import { RankingUsersComponent } from './pages/ranking-users/ranking-users.component';
import { SearchProcedureComponent } from './pages/search-procedure/search-procedure.component';

const routes: Routes = [
  { path: 'busqueda-tramite', component: SearchProcedureComponent },
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
