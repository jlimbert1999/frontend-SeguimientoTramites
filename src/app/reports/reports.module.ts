import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApplicantComponent } from './pages/applicant/applicant.component';
import { AvancedSearchComponent } from './pages/avanced-search/avanced-search.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DependentsComponent } from './pages/dependents/dependents.component';
import { MaterialModule } from '../angular-material/material.module';
import { QuickSearchComponent } from './pages/quick-search/quick-search.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TableProcedureComponent } from './components/table-procedure/table-procedure.component';
import { UnitComponent } from './pages/unit/unit.component';

@NgModule({
  declarations: [
    QuickSearchComponent,
    ApplicantComponent,
    TableProcedureComponent,
    DashboardComponent,
    AvancedSearchComponent,
    DependentsComponent,
    UnitComponent,
  ],
  imports: [CommonModule, ReportsRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule, SharedModule],
})
export class ReportsModule {}
