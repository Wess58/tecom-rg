import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { PathLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
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
    ToastComponent
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
    provideAnimations(), provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
