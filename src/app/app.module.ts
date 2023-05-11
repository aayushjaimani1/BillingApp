import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './signup/signup.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';
import { TopbarComponent } from './dashboard/topbar/topbar.component';
import { AddProductComponent } from './dashboard/add-product/add-product.component';
import { InvoiceComponent } from './dashboard/invoice/invoice.component';
import { ConsultComponent } from './dashboard/consult/consult.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    SignupComponent,
    HomepageComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    NavbarComponent,
    TopbarComponent,
    AddProductComponent,
    InvoiceComponent,
    ConsultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
