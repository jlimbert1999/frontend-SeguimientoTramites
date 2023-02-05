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
// import { NgxGraphModule } from '@swimlane/ngx-graph';
import { InternosComponent } from './internos/internos.component';
import { ExternosComponent } from './externos/externos.component';
import { DialogExternoComponent } from './externos/dialog-externo/dialog-externo.component';
import { DialogInternosComponent } from './internos/dialog-internos/dialog-internos.component';
import { DialogReenvioComponent } from './dialog-reenvio/dialog-reenvio.component';
import { MailFichaComponent } from './mail-ficha/mail-ficha.component';
import { SharedModule } from '../shared/shared.module';
import { FichaInternoComponent } from './internos/ficha-interno/ficha-interno.component';
import { MailFichaInternoComponent } from './internos/mail-ficha-interno/mail-ficha-interno.component';
import { FichaExternoComponent } from './externos/ficha-externo/ficha-externo.component';
import { MailFichaExternoComponent } from './externos/mail-ficha-externo/mail-ficha-externo.component';
import { SolicitantePipe } from './externos/pipes/solicitante.pipe';
import { StatePipe } from './pipes/state.pipe';
import { ConcluidosComponent } from './externos/concluidos/concluidos.component';


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
    FichaInternoComponent,
    MailFichaInternoComponent,
    FichaExternoComponent,
    MailFichaExternoComponent,
    SolicitantePipe,
    StatePipe,
    ConcluidosComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    RouterModule,
    // NgxGraphModule,
    SharedModule,
    
  ]

})
export class TramitesModule { }
