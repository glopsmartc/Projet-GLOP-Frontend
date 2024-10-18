import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { SubscriptionFormComponent } from './subscription-form/subscription-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPassComponent },
  { path: 'subscription-form', component: SubscriptionFormComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];