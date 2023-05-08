import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivosComponent } from './archivos.component';
import { FichaComponent } from '../Tramites/pages/ficha/ficha.component';


const routes: Routes = [
  { path: '', component: ArchivosComponent },
  { path: 'tramite/:tipo/:id', component: FichaComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ArchivosRoutingModule { }
