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
import { StaffFromEmailPipe } from './pipes/staff-from-email.pipe';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { HasAuthorityDirective } from './directives/has-authority.directive';
import { ReportDetailComponent } from './components/reports/report-detail/report-detail.component';
import { InputCommaFormatDirective } from './directives/input-comma-format.directive';
import { FileSizePipe } from './pipes/file-size.pipe';

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
    ImageFallbackDirective,
    StaffFromEmailPipe,
    ImageUploadComponent,
    HasAuthorityDirective,
    ReportDetailComponent,
    InputCommaFormatDirective,
    FileSizePipe
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
