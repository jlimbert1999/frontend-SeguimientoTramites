import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaComponent } from './tabla/tabla.component';
import { MaterialModule } from '../angular-material/material.module';
import { InfoTramiteComponent } from './info-tramite/info-tramite.component';
import { MailHeaderComponent } from './mail-header/mail-header.component';
import { GraphWorkflowComponent } from './graph-workflow/graph-workflow.component';
import { ListWorkflowComponent } from './list-workflow/list-workflow.component';
import { ObservacionesComponent } from './observaciones/observaciones.component';
import { LocationComponent } from './location/location.component';
import { FullnamePipe } from './pipes/fullname.pipe';
import { PanelNotificationComponent } from './panel-notification/panel-notification.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { InfoTramiteInternoComponent } from './info-tramite-interno/info-tramite-interno.component';
import { InfoTramiteExternoComponent } from './info-tramite-externo/info-tramite-externo.component';
import { StatePipe } from './pipes/state.pipe';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitantePipe } from './pipes/solicitante.pipe';
import { TableComponent } from './table/table.component';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { OrganizationChartComponent } from './organization-chart/organization-chart.component';
import { TableReportPreceduresComponent } from './table-report-precedures/table-report-precedures.component';
import { SimpleMatSelectSearchComponent } from './simple-mat-select-search/simple-mat-select-search.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ServerMatSelectSearchComponent } from './server-mat-select-search/server-mat-select-search.component';

@NgModule({
  declarations: [
    TablaComponent,
    InfoTramiteComponent,
    MailHeaderComponent,
    GraphWorkflowComponent,
    ListWorkflowComponent,
    ObservacionesComponent,
    LocationComponent,
    FullnamePipe,
    PanelNotificationComponent,
    PaginatorComponent,
    InfoTramiteInternoComponent,
    InfoTramiteExternoComponent,
    StatePipe,
    ToolbarComponent,
    SolicitantePipe,
    TableComponent,
    OrganizationChartComponent,
    TableReportPreceduresComponent,
    SimpleMatSelectSearchComponent,
    ServerMatSelectSearchComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxGraphModule,
    ReactiveFormsModule,
    AngularSignaturePadModule,
    NgxMatSelectSearchModule
  ],
  exports: [
    TablaComponent,
    InfoTramiteComponent,
    GraphWorkflowComponent,
    ListWorkflowComponent,
    ObservacionesComponent,
    FullnamePipe,
    StatePipe,
    SolicitantePipe,
    PaginatorComponent,

    MailHeaderComponent,
    InfoTramiteExternoComponent,
    InfoTramiteInternoComponent,
    ToolbarComponent,
    TableComponent,
    TableReportPreceduresComponent,
    SimpleMatSelectSearchComponent,
    ServerMatSelectSearchComponent
   
  ]
})
export class SharedModule { }
