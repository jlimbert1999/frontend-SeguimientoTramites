import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../angular-material/material.module';
import { GraphWorkflowComponent } from './components/graph-workflow/graph-workflow.component';
import { ListWorkflowComponent } from './components/list-workflow/list-workflow.component';
import { ObservacionesComponent } from './observaciones/observaciones.component';
import { FullnamePipe } from './pipes/fullname.pipe';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { InternalDetailComponent } from '../procedures/components/internal-detail/internal-detail.component';
import { ExternalDetailComponent } from '../procedures/components/external-detail/external-detail.component';
import { StatePipe } from './pipes/state.pipe';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableReportPreceduresComponent } from './table-report-precedures/table-report-precedures.component';
import { SimpleMatSelectSearchComponent } from './components/simple-mat-select-search/simple-mat-select-search.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ServerMatSelectSearchComponent } from './components/server-mat-select-search/server-mat-select-search.component';
import { EventsProcedureComponent } from './events-procedure/events-procedure.component';
import { BadgePipe } from './pipes/badge.pipe';
import { RouterModule } from '@angular/router';
import { InputSearchProceduresComponent } from './components/input-search-procedures/input-search-procedures.component';

@NgModule({
  declarations: [
    GraphWorkflowComponent,
    ListWorkflowComponent,
    ObservacionesComponent,
    FullnamePipe,
    PaginatorComponent,
    
    StatePipe,
    ToolbarComponent,
    TableReportPreceduresComponent,
    SimpleMatSelectSearchComponent,
    ServerMatSelectSearchComponent,
    EventsProcedureComponent,
    BadgePipe,
    InputSearchProceduresComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxGraphModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    GraphWorkflowComponent,
    ListWorkflowComponent,
    ObservacionesComponent,
    FullnamePipe,
    StatePipe,
    PaginatorComponent,
    ToolbarComponent,
    TableReportPreceduresComponent,
    SimpleMatSelectSearchComponent,
    ServerMatSelectSearchComponent,
    InputSearchProceduresComponent,
    EventsProcedureComponent,
    BadgePipe,
  ],
})
export class SharedModule {}
