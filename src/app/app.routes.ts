import { Routes } from '@angular/router';

import { LoginPageComponent } from './components/login-page/login-page.component';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';
import { SubscriptionFormComponent } from './components/subscription-form/subscription-form.component';
import { SubscriptionFormSecondPageComponent } from './components/subscription-form-second-page/subscription-form-second-page.component';
import { SidebarEmployeeComponent } from './components/sidebar-employee/sidebar-employee.component';

import { ReactiveFormsModule } from '@angular/forms';
import { SubscriptionOffersComponent } from './components/subscription-offers/subscription-offers.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPassComponent },
  { path: 'subscription-form', component: SubscriptionFormComponent, canActivate: [authGuard] },
  { path: 'subscription-form-second-page', component: SubscriptionFormSecondPageComponent, canActivate: [authGuard] },
  { path: 'sidebar-test', component: SidebarEmployeeComponent, canActivate: [authGuard] },
  { path: 'subscription-offers', component: SubscriptionOffersComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/null' },
];

export const appConfig = [
  ReactiveFormsModule
];