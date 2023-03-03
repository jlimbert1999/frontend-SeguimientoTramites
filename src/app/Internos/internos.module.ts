import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternosComponent } from './internos.component';
import { DialogInternosComponent } from './dialog-internos/dialog-internos.component';
import { FichaInternoComponent } from './ficha-interno/ficha-interno.component';
import { MaterialModule } from '../angular-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MailFichaInternoComponent } from './mail-ficha-interno/mail-ficha-interno.component';



@NgModule({
  declarations: [
    InternosComponent,
    DialogInternosComponent,
    FichaInternoComponent,
    MailFichaInternoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
  ]
})
export class InternosModule { }
