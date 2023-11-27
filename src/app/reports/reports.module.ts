import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReportsRoutingModule } from './reports-routing.module';
import { QuickSearchComponent } from './pages/quick-search/quick-search.component';
import { MaterialModule } from '../angular-material/material.module';
import { ApplicantComponent } from './pages/applicant/applicant.component';
import { TableProcedureComponent } from './components/table-procedure/table-procedure.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AvancedSearchComponent } from './pages/avanced-search/avanced-search.component';
import { DependentsComponent } from './pages/dependents/dependents.component';

@NgModule({
  declarations: [
    QuickSearchComponent,
    ApplicantComponent,
    TableProcedureComponent,
    DashboardComponent,
    AvancedSearchComponent,
    DependentsComponent,
  ],
  imports: [CommonModule, ReportsRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule, SharedModule],
})
export class ReportsModule {}
