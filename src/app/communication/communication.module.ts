import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { CommunicationRoutingModule } from './communication-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { ProcedureModule } from '../procedures/procedure.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { SendDialogComponent } from './dialogs/send-dialog/send-dialog.component';
import { MailComponent } from './pages/mail/mail.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { OutboxComponent } from './pages/outbox/outbox.component';

@NgModule({
  declarations: [SendDialogComponent, MailComponent, InboxComponent, OutboxComponent],
  imports: [
    CommonModule,
    CommunicationRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    ProcedureModule,
  ],
})
export class CommunicationModule {}
