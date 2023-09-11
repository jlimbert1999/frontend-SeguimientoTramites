import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InboxComponent } from './pages/inbox/inbox.component';
import { OutboxComponent } from './pages/outbox/outbox.component';
import { MailComponent } from './pages/mail/mail.component';
import { FichaComponent } from '../procedures/pages/ficha/ficha.component';

const routes: Routes = [
  { path: 'entrada', component: InboxComponent },
  { path: 'salida', component: OutboxComponent },
  { path: 'entrada/:id', component: MailComponent },
  { path: 'salida/:id', component: FichaComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class CommunicationRoutingModule {}
