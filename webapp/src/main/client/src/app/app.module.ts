import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeCs from '@angular/common/locales/cs';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { FacetsComponent } from './components/facets/facets.component';
import { FooterComponent } from './components/footer/footer.component';
import { ResultsComponent } from './pages/results/results.component';
import { HomeComponent } from './pages/home/home.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FacetsUsedComponent } from './components/facets/facets-used/facets-used.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { FormsModule } from '@angular/forms';
import { AppState } from './app.state';
import { AppConfiguration } from './app-configuration';
import { ApiInterceptor } from './api.interceptor';
import { AppService } from './app.service';
import { VdkItemComponent } from './components/vdk-item/vdk-item.component';
import { RdczItemComponent } from './components/rdcz-item/rdcz-item.component';
import { CzbrdItemComponent } from './components/czbrd-item/czbrd-item.component';
import { DpzItemComponent } from './components/dpz-item/dpz-item.component';
import { EpItemComponent } from './components/ep-item/ep-item.component';
import { ResultItemComponent } from './components/result-item/result-item.component';
import { ChartBarComponent } from './components/chart-bar/chart-bar.component';
import { FlotComponent } from './components/flot/flot.component';

registerLocaleData(localeCs, 'cs');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


const providers: any[] =[
  { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  AppState, AppConfiguration, HttpClient, 
  { provide: APP_INITIALIZER, useFactory: (config: AppConfiguration) => () => config.load(), deps: [AppConfiguration], multi: true },
  DatePipe, DecimalPipe, AppService
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchbarComponent,
    FacetsComponent,
    FacetsUsedComponent,
    PaginatorComponent,
    FooterComponent,
    ResultsComponent,
    HomeComponent,
    VdkItemComponent,
    RdczItemComponent,
    CzbrdItemComponent,
    DpzItemComponent,
    EpItemComponent,
    ResultItemComponent,
    ChartBarComponent,
    FlotComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  providers,
  bootstrap: [AppComponent]
})
export class AppModule { }
