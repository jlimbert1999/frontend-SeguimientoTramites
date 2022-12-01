import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaComponent } from './tabla/tabla.component';
import { MaterialModule } from '../angular-material/material.module';



@NgModule({
  declarations: [
    TablaComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    TablaComponent
  ]
})
export class SharedModule { }
