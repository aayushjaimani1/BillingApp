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
import { CouponComponent } from './dashboard/coupon/coupon.component';
import { ReportComponent } from './dashboard/report/report.component';
import { HistoryComponent } from './dashboard/history/history.component';
import { RedirectComponent } from './dashboard/redirect/redirect.component';
import { NgxPrintModule } from 'ngx-print';

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
    ConsultComponent,
    CouponComponent,
    ReportComponent,
    HistoryComponent,
    RedirectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPrintModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
