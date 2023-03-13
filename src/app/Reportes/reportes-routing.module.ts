import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FichaComponent } from './pages/ficha/ficha.component';


const routes: Routes = [
  // EXTERNOS
  { path: 'ficha', component: FichaComponent },
];

@NgModule({
  declarations: [
    
  ],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ReportesRoutingModule { 
  
}
