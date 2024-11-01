import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { SubscriptionFormComponent } from './subscription-form/subscription-form.component';
import { SubscriptionFormSecondPageComponent } from './subscription-form-second-page/subscription-form-second-page.component';
import { SidebarEmployeeComponent } from './sidebar-employee/sidebar-employee.component';


import { ReactiveFormsModule } from '@angular/forms';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPassComponent },
  { path: 'subscription-form', component: SubscriptionFormComponent },
  { path: 'subscription-form-second-page', component: SubscriptionFormSecondPageComponent },
  { path: 'sidebar-test', component: SidebarEmployeeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];


export const appConfig = [
  ReactiveFormsModule
];