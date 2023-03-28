import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FichaComponent } from '../Tramites/pages/ficha/ficha.component';

import { BandejaEntradaComponent } from './pages/bandeja-entrada/bandeja-entrada.component';
import { BandejaSalidaComponent } from './pages/bandeja-salida/bandeja-salida.component';
import { MailComponent } from './pages/mail/mail.component';

const routes: Routes = [
  // EXTERNOS
  { path: 'entrada', component: BandejaEntradaComponent },
  { path: 'entrada/mail/:id', component: MailComponent },
  { path: 'salida', component: BandejaSalidaComponent },
  { path: 'salida/mail/:tipo/:id', component: FichaComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class BandejasRoutingModule { }
