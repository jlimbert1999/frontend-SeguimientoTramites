import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { ConfiguracionesModule } from './Configuraciones/configuraciones.module';
import { MaterialModule } from './angular-material/material.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './interceptors/interceptor.service';
import { AuthModule } from './auth/auth.module';
import { ToastrModule } from 'ngx-toastr';
import { ReportesModule } from './Reportes/reportes.module';

// date format spanish 
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ExternosModule } from './Externos/externos.module';
import { ArchivosModule } from './Archivos/archivos.module';
import { InternosModule } from './Internos/internos.module';
import { BandejasModule } from './Bandejas/bandejas.module';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // ToastrModule added
    ConfiguracionesModule,
    AuthModule,
    ExternosModule,
    ArchivosModule,
    ReportesModule,
    MaterialModule,
    InternosModule,
    BandejasModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
