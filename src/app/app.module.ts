import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NgmodelDebounceChangeDirective } from './directives/ngmodel-debounce-change.directive';
import { UsersComponent } from './components/auth/users/users.component';
import { ShopComponent } from './components/shop/shop.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { LoginComponent } from './components/auth/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NgmodelDebounceChangeDirective,
    UsersComponent,
    ShopComponent,
    NavbarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    // HttpClientModule
  ],
  providers: [
    provideAnimations(),provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
