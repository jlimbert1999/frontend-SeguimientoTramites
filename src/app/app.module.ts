import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdministrationModule } from './administration/administration.module';
import { MaterialModule } from './angular-material/material.module';
import { InterceptorService } from './services/interceptor.service';
import { AuthModule } from './auth/auth.module';
import { ReportesModule } from './Reportes/reportes.module';
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
    AdministrationModule,
    AuthModule,
    ReportesModule,
    MaterialModule,
    CommunicationModule,
    ProcedureModule,
    SharedModule,
    RouterModule,
    ToastrModule.forRoot(),
  ],
})
export class AppModule {}
