import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../angular-material/material.module';
import { GraphWorkflowComponent } from './components/procedures/graph-workflow/graph-workflow.component';
import { ListWorkflowComponent } from './components/procedures/list-workflow/list-workflow.component';
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
import { BadgePipe } from './pipes/badge.pipe';
import { RouterModule } from '@angular/router';
import { InputSearchProceduresComponent } from './components/procedures/input-search-procedures/input-search-procedures.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { LineComponent } from './components/charts/line/line.component';
import { SidenavButtonComponent } from './components/sidenav-button/sidenav-button.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
@NgModule({
  declarations: [
    GraphWorkflowComponent,
    ListWorkflowComponent,
    FullnamePipe,
    PaginatorComponent,

    StatePipe,
    ToolbarComponent,
    TableReportPreceduresComponent,
    SimpleMatSelectSearchComponent,
    ServerMatSelectSearchComponent,
    BadgePipe,
    InputSearchProceduresComponent,
    TimelineComponent,
    LineComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxGraphModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    SidenavButtonComponent,
    ProgressSpinnerComponent,
    FormsModule,
    RouterModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  exports: [
    TimelineComponent,
    GraphWorkflowComponent,
    ListWorkflowComponent,
    FullnamePipe,
    StatePipe,
    PaginatorComponent,
    ToolbarComponent,
    TableReportPreceduresComponent,
    SimpleMatSelectSearchComponent,
    ServerMatSelectSearchComponent,
    InputSearchProceduresComponent,
    BadgePipe,
    LineComponent,
    SidenavButtonComponent,
    ProgressSpinnerComponent
  ],
})
export class SharedModule {}
