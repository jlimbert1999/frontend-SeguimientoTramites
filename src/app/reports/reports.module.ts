import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApplicantComponent } from './pages/applicant/applicant.component';
import { AvancedSearchComponent } from './pages/avanced-search/avanced-search.component';
import { DependentsComponent } from './pages/dependents/dependents.component';
import { MaterialModule } from '../material/material.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TableProcedureComponent } from './components/table-procedure/table-procedure.component';
import { UnitComponent } from './pages/unit/unit.component';
import { DashboardTotalCommunicationsComponent } from './pages/dashboard-total-communications/dashboard-total-communications.component';
import { RankingUsersComponent } from './pages/ranking-users/ranking-users.component';
import { SearchProcedureComponent } from './pages/search-procedure/search-procedure.component';

@NgModule({
  declarations: [
    SearchProcedureComponent,
    ApplicantComponent,
    TableProcedureComponent,
    AvancedSearchComponent,
    DependentsComponent,
    UnitComponent,
    DashboardTotalCommunicationsComponent,
    RankingUsersComponent,
  
  ],
  imports: [CommonModule, ReportsRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule, SharedModule],
})
export class ReportsModule {}
