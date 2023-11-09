import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { QuickSearchComponent } from './pages/quick-search/quick-search.component';
import { MaterialModule } from '../angular-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [QuickSearchComponent],
  imports: [CommonModule, ReportsRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule],
})
export class ReportsModule {}
