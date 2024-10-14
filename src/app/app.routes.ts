import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPassComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];