import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { DialogExternoComponent } from './dialogs/dialog-externo/dialog-externo.component';
import { DialogInternosComponent } from './dialogs/dialog-internos/dialog-internos.component';
import { ExternalDetailComponent } from './components/external-detail/external-detail.component';
import { ExternosComponent } from './pages/externos/externos.component';
import { FichaComponent } from './pages/ficha/ficha.component';
import { FilterObservationsPipe } from './pipes/filter-observations.pipe';
import { InternalDetailComponent } from './components/internal-detail/internal-detail.component';
import { InternosComponent } from './pages/internos/internos.component';
import { MaterialModule } from '../angular-material/material.module';
import { ObservationsComponent } from './components/observations/observations.component';
import { ProcedureRoutingModule } from './procedure-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SolicitantePipe } from './pipes/solicitante.pipe';
import { ArchivesComponent } from './pages/archives/archives.component';

@NgModule({
  declarations: [
    FichaComponent,
    ExternosComponent,
    InternosComponent,
    DialogInternosComponent,
    DialogExternoComponent,
    InternalDetailComponent,
    ExternalDetailComponent,
    SolicitantePipe,
    FilterObservationsPipe,
    ObservationsComponent,
    ArchivesComponent,
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
  exports: [
    InternalDetailComponent,
    ExternalDetailComponent,
    ObservationsComponent,
  ],
})
export class ProcedureModule {}
