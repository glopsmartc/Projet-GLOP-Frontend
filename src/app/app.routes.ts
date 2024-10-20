import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { SubscriptionFormComponent } from './subscription-form/subscription-form.component';
import { SidebarClientComponent } from './sidebar-client/sidebar-client.component';


import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPassComponent },
  { path: 'subscription-form', component: SubscriptionFormComponent },
  { path: 'sidebar-test', component: SidebarClientComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];


export const appConfig = [
  provideHttpClient(),
  ReactiveFormsModule
];