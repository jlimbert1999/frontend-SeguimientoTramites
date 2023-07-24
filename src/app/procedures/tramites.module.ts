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
import { TramitesRoutingModule } from './tramites-routing.module';
import { SolicitantePipe } from './pipes/solicitante.pipe';

@NgModule({
  declarations: [
    FichaComponent,
    ExternosComponent,
    InternosComponent,
    DialogInternosComponent,
    DialogExternoComponent,
    SolicitantePipe
  ],
  imports: [
    CommonModule,
    TramitesRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    RouterModule,

  ]
})
export class TramitesModule { }
