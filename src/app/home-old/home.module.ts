import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';;
import { PerfilComponent } from './pages/perfil/perfil.component';
import { MaterialModule } from '../angular-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RecursosComponent } from './pages/recursos/recursos.component';
import { NotificacionsComponent } from './pages/notificacions/notificacions.component';



@NgModule({
  declarations: [
    PerfilComponent,
    RecursosComponent,
    NotificacionsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class HomeModule { }
