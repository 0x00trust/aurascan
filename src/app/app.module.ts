import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule, NgbNavModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NgProgressModule } from 'ngx-progressbar';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnvironmentService } from './core/data-services/environment.service';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { GlobalErrorHandler } from './core/helpers/global-error';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { DEFAULT_TIMEOUT, RequestTimeoutHttpInterceptor } from './core/helpers/timeout.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { CommonService } from './core/services/common.service';
import { FeeGrantService } from './core/services/feegrant.service';
import { MappingErrorService } from './core/services/mapping-error.service';
import { SoulboundService } from './core/services/soulbound.service';
import { TokenService } from './core/services/token.service';
import { Globals } from './global/global';
import { LayoutsModule } from './layouts/layouts.module';
import { MaterialModule } from './material.module';
import { MediaExpandModule } from './shared/components/media-expand/media-expand.module';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

const maskConfig: Partial<IConfig> = {
  thousandSeparator: ',',
};

export const MY_FORMATS = {
  parse: {
    dateInput: "YYYY-MM-DD"
  },
  display: {
    dateInput: "YYYY-MM-DD",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "YYYY-MM-DD",
    monthYearA11yLabel: "MMMM YYYY"
  }
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgProgressModule.withConfig({
      spinnerPosition: 'left',
      color: 'blue',
    }),
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    LayoutsModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbNavModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    ToastrModule.forRoot({ positionClass: 'inline', maxOpened: 2 }),
    NgxMaskModule.forRoot(maskConfig),
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MediaExpandModule, 
    MaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RequestTimeoutHttpInterceptor, multi: true },
    { provide: DEFAULT_TIMEOUT, useValue: 60000 },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
    EnvironmentService,
    DatePipe,
    Globals,
    {
      provide: APP_INITIALIZER,
      useFactory: (environmentService: EnvironmentService) => () => environmentService.load(),
      multi: true,
      deps: [EnvironmentService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    CommonService,
    TokenService,
    FeeGrantService,
    SoulboundService,
    MappingErrorService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
