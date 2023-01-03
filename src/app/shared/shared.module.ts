import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaComponent } from './tabla/tabla.component';
import { MaterialModule } from '../angular-material/material.module';
import { InfoTramiteComponent } from './info-tramite/info-tramite.component';
import { MailHeaderComponent } from './mail-header/mail-header.component';
import { GraphWorkflowComponent } from './graph-workflow/graph-workflow.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ListWorkflowComponent } from './list-workflow/list-workflow.component';
import { ObservacionesComponent } from './observaciones/observaciones.component';
import { LocationComponent } from './location/location.component';



@NgModule({
  declarations: [
    TablaComponent,
    InfoTramiteComponent,
    MailHeaderComponent,
    GraphWorkflowComponent,
    ListWorkflowComponent,
    ObservacionesComponent,
    LocationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxGraphModule,
  ],
  exports: [
    TablaComponent,
    InfoTramiteComponent,
    GraphWorkflowComponent,
    ListWorkflowComponent,
    ObservacionesComponent
  ]
})
export class SharedModule { }
