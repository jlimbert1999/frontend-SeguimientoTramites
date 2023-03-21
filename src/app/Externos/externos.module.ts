import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../angular-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FichaExternoComponent } from './pages/ficha-externo/ficha-externo.component';
import { ExternosComponent } from './externos.component';
import { SolicitantePipe } from './pipes/solicitante.pipe';
import { DialogExternoComponent } from './dialog-externo/dialog-externo.component';



@NgModule({
  declarations: [
    FichaExternoComponent,
    ExternosComponent,
    SolicitantePipe,
    DialogExternoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    RouterModule,
    // NgxGraphModule,
    SharedModule,
    MaterialModule
  ]
})
export class ExternosModule { }
