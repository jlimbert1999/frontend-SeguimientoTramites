import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { NotPermissionsComponent } from './pages/not-permissions/not-permissions.component';



@NgModule({
  declarations: [
    NotFoundPageComponent,
    NotPermissionsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
