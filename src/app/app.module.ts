import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdministrationModule } from './administration/administration.module';
import { MaterialModule } from './angular-material/material.module';
import { InterceptorService } from './services/interceptor.service';
import { AuthModule } from './auth/auth.module';
import { ReportesModule } from './Reportes/reportes.module';
import { ArchiveModule } from './archives/archive.module';
import { ProcedureModule } from './procedures/procedure.module';
import { SharedModule } from './shared/shared.module';
import { PresentationComponent } from './pages/presentation/presentation.component';
import { HomeComponent } from './pages/home/home.component';
import { CommunicationModule } from './communication/communication.module';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [AppComponent, PresentationComponent, HomeComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AdministrationModule,
    AuthModule,
    ArchiveModule,
    ReportesModule,
    MaterialModule,
    CommunicationModule,
    ProcedureModule,
    SharedModule,
    RouterModule,
  ],
})
export class AppModule {}
