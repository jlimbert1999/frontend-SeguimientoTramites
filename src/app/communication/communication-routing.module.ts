import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InboxComponent } from './pages/inbox/inbox.component';
import { OutboxComponent } from './pages/outbox/outbox.component';
import { MailComponent } from './pages/mail/mail.component';
import { FichaComponent } from '../procedures/pages/ficha/ficha.component';

const routes: Routes = [
  // EXTERNOS
  { path: 'entrada', component: InboxComponent },
  { path: 'entrada/mail/:id', component: MailComponent },
  { path: 'salida', component: OutboxComponent },
  { path: 'salida/mail/:tipo/:id', component: FichaComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class CommunicationRoutingModule { }
