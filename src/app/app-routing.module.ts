import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HomeComponent } from './dashboard/home/home.component';
import { AddProductComponent } from './dashboard/add-product/add-product.component';

const routes: Routes = [
  {
    path: "",
    component: HomepageComponent,
    children: [
      {
        path: "",
        component: LandingPageComponent
      },
      {
        path: "signup",
        component: SignupComponent
      },
      {
        path: "login",
        component: LoginComponent
      }
    ]
  },
 
  {
    path: "dashboard",
    component: DashboardComponent,
    children: [
      {
        path: "",
        component: HomeComponent
      },
      {
        path: "add",
        component: AddProductComponent
      }
    ]
  }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
