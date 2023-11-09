import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { ExternalDialogComponent } from './dialogs/external-dialog/external-dialog.component';
import { InternalDialogComponent } from './dialogs/internal-dialog/internal-dialog.component';
import { ExternalDetailComponent } from './components/external-detail/external-detail.component';
import { ExternalComponent } from './pages/external/external.component';
import { DetailComponent } from './pages/detail/detail.component';
import { FilterObservationsPipe } from './pipes/filter-observations.pipe';
import { InternalDetailComponent } from './components/internal-detail/internal-detail.component';
import { InternalComponent } from './pages/internal/internal.component';
import { MaterialModule } from '../angular-material/material.module';
import { ObservationsComponent } from './components/observations/observations.component';
import { ProcedureRoutingModule } from './procedure-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SolicitantePipe } from './pipes/solicitante.pipe';
import { ArchivesComponent } from './pages/archives/archives.component';
import { EventDialogComponent } from './dialogs/event-dialog/event-dialog.component';

@NgModule({
  declarations: [
    DetailComponent,
    ExternalComponent,
    InternalComponent,
    InternalDialogComponent,
    ExternalDialogComponent,
    InternalDetailComponent,
    ExternalDetailComponent,
    SolicitantePipe,
    FilterObservationsPipe,
    ObservationsComponent,
    ArchivesComponent,
    EventDialogComponent,
  ],
  imports: [
    CommonModule,
    ProcedureRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    RouterModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  exports: [InternalDetailComponent, ExternalDetailComponent, ObservationsComponent],
})
export class ProcedureModule {}
