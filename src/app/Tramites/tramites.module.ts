import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../angular-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BandejaEntradaComponent } from './bandeja-entrada/bandeja-entrada.component';
import { BandejaSalidaComponent } from './bandeja-salida/bandeja-salida.component';
import { DialogRemisionComponent } from './dialog-remision/dialog-remision.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ControlComponent } from './control/control.component';
import { FichaComponent } from './ficha/ficha.component';
import { RouterModule } from '@angular/router';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { InternosComponent } from './internos/internos.component';
import { ExternosComponent } from './externos/externos.component';
import { DialogExternoComponent } from './externos/dialog-externo/dialog-externo.component';
import { DialogInternosComponent } from './internos/dialog-internos/dialog-internos.component';
import { DialogReenvioComponent } from './dialog-reenvio/dialog-reenvio.component';
import { MailFichaComponent } from './mail-ficha/mail-ficha.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    BandejaEntradaComponent,
    BandejaSalidaComponent,
    DialogRemisionComponent,
    ControlComponent,
    FichaComponent,
    InternosComponent,
    ExternosComponent,
    DialogExternoComponent,
    DialogInternosComponent,
    DialogReenvioComponent,
    MailFichaComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    RouterModule,
    NgxGraphModule,
    SharedModule
  ]

})
export class TramitesModule { }
