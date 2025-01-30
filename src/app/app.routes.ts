import { Routes } from '@angular/router';

import { LoginPageComponent } from './clientComponents/login-page/login-page.component';
import { ForgotPassComponent } from './clientComponents/forgot-pass/forgot-pass.component';
import { ResetPassComponent } from './clientComponents/reset-pass/reset-pass.component';
import { SubscriptionFormComponent } from './clientComponents/subscription-form/subscription-form.component';
import { SubscriptionFormSecondPageComponent } from './clientComponents/subscription-form-second-page/subscription-form-second-page.component';

import { ReactiveFormsModule } from '@angular/forms';
import { SubscriptionOffersComponent } from './clientComponents/subscription-offers/subscription-offers.component';
import { SignContractComponent } from './clientComponents/sign-contract/sign-contract.component';
import { MesContratsComponent } from './clientComponents/mes-contrats/mes-contrats.component';

import { ErrorPageComponent } from './clientComponents/error-page/error-page.component';
import { ClientContractsComponent } from './conseillerComponents/client-contracts/client-contracts.component';
import { CalculateEmissionComponent } from './clientComponents/calculate-emission/calculate-emission.component';

import { authGuard } from './guards/auth.guard';

import { MatDialogModule } from '@angular/material/dialog';
import { AssistanceRequestComponent } from './clientComponents/assistance-request/assistance-request.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPassComponent },
  { path: 'reset-password', component: ResetPassComponent },
  { path: 'subscription-form', component: SubscriptionFormComponent, canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] },},
  { path: 'subscription-form-second-page', component: SubscriptionFormSecondPageComponent, canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] },},
  { path: 'subscription-offers', component: SubscriptionOffersComponent, canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] },},
  { path: 'sign-contract', component: SignContractComponent, canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] },},
  { path: 'mes-contrats', component: MesContratsComponent, canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] },},
  { path: 'calculate-emission', component: CalculateEmissionComponent, canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] },},
  { path: 'assistance-request', component: AssistanceRequestComponent, canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] },},
  { path: 'error-page', component: ErrorPageComponent },
  { path: 'clients-contracts', component: ClientContractsComponent, canActivate: [authGuard], data: { roles: ['ROLE_CONSEILLER'] } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/error-page' },
];

export const appConfig = [
  ReactiveFormsModule,
  MatDialogModule
];
