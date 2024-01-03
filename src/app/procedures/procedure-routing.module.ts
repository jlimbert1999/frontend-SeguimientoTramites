import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalComponent } from './pages/internal/internal.component';
import { ExternalComponent } from './pages/external/external.component';
import { DetailComponent } from './pages/detail/detail.component';
import { ArchivesComponent } from './pages/archives/archives.component';

const routes: Routes = [
  { path: 'internos', component: InternalComponent },
  { path: 'externos', component: ExternalComponent },
  { path: 'archivados', component: ArchivesComponent },
  { path: ':from/:group/:id', component: DetailComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class ProcedureRoutingModule {}
