import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { QuickSearchComponent } from './pages/quick-search/quick-search.component';
import { MaterialModule } from '../angular-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicantComponent } from './pages/applicant/applicant.component';
import { TableProcedureComponent } from './components/table-procedure/table-procedure.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [QuickSearchComponent, ApplicantComponent, TableProcedureComponent],
  imports: [CommonModule, ReportsRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule, SharedModule],
})
export class ReportsModule {}
