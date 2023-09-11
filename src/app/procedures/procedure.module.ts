import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { RouterModule } from '@angular/router';

import { FichaComponent } from './pages/ficha/ficha.component';
import { InternosComponent } from './pages/internos/internos.component';
import { ExternosComponent } from './pages/externos/externos.component';
import { DialogInternosComponent } from './dialogs/dialog-internos/dialog-internos.component';
import { DialogExternoComponent } from './dialogs/dialog-externo/dialog-externo.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../angular-material/material.module';
import { ProcedureRoutingModule } from './procedure-routing.module';
import { SolicitantePipe } from './pipes/solicitante.pipe';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { InternalDetailComponent } from './components/internal-detail/internal-detail.component';
import { ExternalDetailComponent } from './components/external-detail/external-detail.component';

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
  exports:[
    InternalDetailComponent,
    ExternalDetailComponent
  ]
})
export class ProcedureModule {}
