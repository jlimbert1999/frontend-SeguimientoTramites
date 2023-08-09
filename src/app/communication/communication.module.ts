import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { SharedModule } from '../shared/shared.module';
import { SendDialogComponent } from './dialogs/send-dialog/send-dialog.component';
import { MaterialModule } from '../angular-material/material.module';
import { MailComponent } from './pages/mail/mail.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { OutboxComponent } from './pages/outbox/outbox.component';
import { CommunicationRoutingModule } from './communication-routing.module';

@NgModule({
  declarations: [
    SendDialogComponent,
    MailComponent,
    InboxComponent,
    OutboxComponent,
  ],
  imports: [
    CommonModule,
    CommunicationRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
  ]
})
export class CommunicationModule { }
