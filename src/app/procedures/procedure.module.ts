import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { RegisterExternalComponent } from './pages/register-external/register-external.component';
import { RegisterInternalComponent } from './pages/register-internal/register-internal.component';
import { ExternalDetailComponent } from './components/external-detail/external-detail.component';
import { InputSearchProceduresComponent } from './components/input-search-procedures/input-search-procedures.component';
import { ExternalComponent } from './pages/external/external.component';
import { DetailComponent } from './pages/detail/detail.component';
import { FilterObservationsPipe } from './pipes/filter-observations.pipe';
import { InternalDetailComponent } from './components/internal-detail/internal-detail.component';
import { InternalComponent } from './pages/internal/internal.component';
import { MaterialModule } from '../material/material.module';
import { ObservationsComponent } from './components/observations/observations.component';
import { ProcedureRoutingModule } from './procedure-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ArchivesComponent } from './pages/archives/archives.component';

@NgModule({
  declarations: [
    DetailComponent,
    ExternalComponent,
    InternalComponent,
    RegisterInternalComponent,
    RegisterExternalComponent,
    InternalDetailComponent,
    ExternalDetailComponent,
    ObservationsComponent,
    ArchivesComponent,
    FilterObservationsPipe,
  ],
  imports: [
    CommonModule,
    ProcedureRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    InputSearchProceduresComponent,
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
