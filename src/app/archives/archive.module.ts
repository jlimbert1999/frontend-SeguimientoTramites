import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../angular-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AdministrationComponent } from './pages/administration/administration.component';
import { ArchiveRoutingModule } from './archive-routing.module';

@NgModule({
  declarations: [AdministrationComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ArchiveRoutingModule,
  ],
})
export class ArchiveModule {}
