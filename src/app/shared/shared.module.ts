import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../angular-material/material.module';
import { GraphWorkflowComponent } from './components/graph-workflow/graph-workflow.component';
import { ListWorkflowComponent } from './components/list-workflow/list-workflow.component';
import { ObservacionesComponent } from './observaciones/observaciones.component';
import { FullnamePipe } from './pipes/fullname.pipe';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { InfoTramiteInternoComponent } from './info-tramite-interno/info-tramite-interno.component';
import { InfoTramiteExternoComponent } from './info-tramite-externo/info-tramite-externo.component';
import { StatePipe } from './pipes/state.pipe';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitantePipe } from './pipes/solicitante.pipe';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { TableReportPreceduresComponent } from './table-report-precedures/table-report-precedures.component';
import { SimpleMatSelectSearchComponent } from './components/simple-mat-select-search/simple-mat-select-search.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ServerMatSelectSearchComponent } from './components/server-mat-select-search/server-mat-select-search.component';
import { EventsProcedureComponent } from './events-procedure/events-procedure.component';
import { BadgePipe } from './pipes/badge.pipe';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    GraphWorkflowComponent,
    ListWorkflowComponent,
    ObservacionesComponent,
    FullnamePipe,
    PaginatorComponent,
    InfoTramiteInternoComponent,
    InfoTramiteExternoComponent,
    StatePipe,
    ToolbarComponent,
    SolicitantePipe,
    TableReportPreceduresComponent,
    SimpleMatSelectSearchComponent,
    ServerMatSelectSearchComponent,
    EventsProcedureComponent,
    BadgePipe,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxGraphModule,
    ReactiveFormsModule,
    AngularSignaturePadModule,
    NgxMatSelectSearchModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    GraphWorkflowComponent,
    ListWorkflowComponent,
    ObservacionesComponent,
    FullnamePipe,
    StatePipe,
    SolicitantePipe,
    PaginatorComponent,
    InfoTramiteExternoComponent,
    InfoTramiteInternoComponent,
    ToolbarComponent,
    TableReportPreceduresComponent,
    SimpleMatSelectSearchComponent,
    ServerMatSelectSearchComponent,
    EventsProcedureComponent,
    BadgePipe

  ]
})
export class SharedModule { }
