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
import { InternosComponent } from '../Internos/internos.component';
import { DialogExternoComponent } from '../Externos/dialog-externo/dialog-externo.component';
import { DialogInternosComponent } from '../Internos/dialog-internos/dialog-internos.component';
import { DialogReenvioComponent } from './dialog-reenvio/dialog-reenvio.component';
import { MailFichaComponent } from './mail-ficha/mail-ficha.component';
import { SharedModule } from '../shared/shared.module';
import { FichaInternoComponent } from '../Internos/ficha-interno/ficha-interno.component';
import { MailFichaInternoComponent } from '../Internos/mail-ficha-interno/mail-ficha-interno.component';

import { ConcluidosComponent } from '../Externos/concluidos/concluidos.component';


@NgModule({
  declarations: [
    BandejaEntradaComponent,
    BandejaSalidaComponent,
    DialogRemisionComponent,
    ControlComponent,
    FichaComponent,
    // InternosComponent,

   
    // DialogInternosComponent,
    DialogReenvioComponent,
    MailFichaComponent,
    // FichaInternoComponent,
    // MailFichaInternoComponent,
   
   
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
