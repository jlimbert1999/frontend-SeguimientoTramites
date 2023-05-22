import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { SharedModule } from '../shared/shared.module';
import { DialogRemisionComponent } from './dialogs/dialog-remision/dialog-remision.component';
import { MaterialModule } from '../angular-material/material.module';
import { MailComponent } from './pages/mail/mail.component';
import { BandejaEntradaComponent } from './pages/bandeja-entrada/bandeja-entrada.component';
import { BandejaSalidaComponent } from './pages/bandeja-salida/bandeja-salida.component';

@NgModule({
  declarations: [
    DialogRemisionComponent,
    MailComponent,
    BandejaEntradaComponent,
    BandejaSalidaComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
  ]
})
export class BandejasModule { }
