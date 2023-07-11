import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { AdministrationModule } from './administration/administration.module';
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
import { ArchivosModule } from './Archivos/archivos.module';
import { BandejasModule } from './Bandejas/bandejas.module';
import { TramitesModule } from './Tramites/tramites.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HomeModule } from './home/home.module';
import { SharedModule } from "./shared/shared.module";
registerLocaleData(localeEs, 'es');

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true
        },
        { provide: LOCALE_ID, useValue: 'es' },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        AdministrationModule,
        AuthModule,
        ArchivosModule,
        ReportesModule,
        MaterialModule,
        BandejasModule,
        TramitesModule,
        HomeModule,
        SharedModule
    ]
})
export class AppModule { }
