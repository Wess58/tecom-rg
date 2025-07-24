import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { PathLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';
import { NgxPaginationModule } from 'ngx-pagination';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgmodelDebounceChangeDirective } from './directives/ngmodel-debounce-change.directive';
import { UsersComponent } from './components/auth/users/users.component';
import { ShopComponent } from './components/shop/shop.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ReportsListComponent } from './components/reports/reports-list/reports-list.component';
import { CreateReportComponent } from './components/reports/create-report/create-report.component';
import { ToastComponent } from './shared/toast/toast.component';
import { SanitizeFileUrlPipe } from './pipes/sanitize-file-url.pipe';
import { AppTooltipDirective } from './directives/app-tooltip.directive';
import { ImageFallbackDirective } from './directives/image-fallback.directive';

@NgModule({
  declarations: [
    AppComponent,
    NgmodelDebounceChangeDirective,
    UsersComponent,
    ShopComponent,
    NavbarComponent,
    LoginComponent,
    ReportsListComponent,
    CreateReportComponent,
    ToastComponent,
    SanitizeFileUrlPipe,
    AppTooltipDirective,
    ImageFallbackDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxPaginationModule
    // HttpClientModule
  ],
  providers: [
    provideAnimations(), provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
