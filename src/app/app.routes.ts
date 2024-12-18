import { Routes } from '@angular/router';

import { LoginPageComponent } from './components/login-page/login-page.component';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';
import { ResetPassComponent } from './components/reset-pass/reset-pass.component';
import { SubscriptionFormComponent } from './components/subscription-form/subscription-form.component';
import { SubscriptionFormSecondPageComponent } from './components/subscription-form-second-page/subscription-form-second-page.component';

import { ReactiveFormsModule } from '@angular/forms';
import { SubscriptionOffersComponent } from './components/subscription-offers/subscription-offers.component';
import { SignContractComponent } from './components/sign-contract/sign-contract.component';
import { MesContratsComponent } from './components/mes-contrats/mes-contrats.component';

import { ErrorPageComponent } from './components/error-page/error-page.component'; 
import { ClientContractsComponent } from './conseillerComponents/client-contracts/client-contracts.component';

import { authGuard } from './guards/auth.guard';

import { MatDialogModule } from '@angular/material/dialog';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPassComponent },
  { path: 'reset-password', component: ResetPassComponent },
  {
    path: 'subscription-form',
    component: SubscriptionFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_CLIENT'] },
  },
  {
    path: 'subscription-form-second-page',
    component: SubscriptionFormSecondPageComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_CLIENT'] },
  },
  {
    path: 'subscription-offers',
    component: SubscriptionOffersComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_CLIENT'] },
  },
  {
    path: 'sign-contract',
    component: SignContractComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_CLIENT'] },
  },
  {
    path: 'mes-contrats',
    component: MesContratsComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_CLIENT'] },
  },
  { path: 'error-page', component: ErrorPageComponent },
  { path: 'clients-contracts', component: ClientContractsComponent, canActivate: [authGuard], data: { roles: ['ROLE_CONSEILLER'] } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/error-page' },
];

export const appConfig = [
  ReactiveFormsModule,
  MatDialogModule
];