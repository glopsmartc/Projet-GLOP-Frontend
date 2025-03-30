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
import { ConstatAmiableComponent } from './clientComponents/constat-amiable/constat-amiable.component';

import { ErrorPageComponent } from './clientComponents/error-page/error-page.component';
import { ClientContractsComponent } from './conseillerComponents/client-contracts/client-contracts.component';
import { CalculateEmissionComponent } from './clientComponents/calculate-emission/calculate-emission.component';

import { authGuard } from './guards/auth.guard';

import { MatDialogModule } from '@angular/material/dialog';
import { AssistanceRequestComponent } from './clientComponents/assistance-request/assistance-request.component';
import { AssistanceRequestListComponent } from './clientComponents/assistance-request-list/assistance-request-list.component';
import { ClientListComponent } from './conseillerComponents/clients-list/clients-list.component';
import { SousPartenairesListComponent } from './conseillerComponents/sous-partenaires-list/sous-partenaires-list.component';
import { AssistanceRequestsLogisComponent } from './logisticienComponents/assistance-requests-logis/assistance-requests-logis.component';
import { AssistanceRequestsConsComponent } from './conseillerComponents/assistance-requests-cons/assistance-requests-cons.component';
import { PartnersListComponent } from './logisticienComponents/partners-list/partners-list.component';
import { AssistanceRequestsPartComponent } from './paertenaireComponents/assistance-requests-part/assistance-requests-part.component';
import { SubPartnersListPartComponent } from './paertenaireComponents/sub-partners-list-part/sub-partners-list-part.component';

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
  { path: 'constat-amiable', component: ConstatAmiableComponent, canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] },},
  { path: 'clients-contracts', component: ClientContractsComponent, canActivate: [authGuard], data: { roles: ['ROLE_CONSEILLER'] } },
  { path: 'clients-list', component: ClientListComponent, canActivate: [authGuard], data: { roles: ['ROLE_CONSEILLER'] },},
  { path: 'sub-partners-list', component: SousPartenairesListComponent, canActivate: [authGuard], data: { roles: ['ROLE_CONSEILLER', 'ROLE_LOGISTICIEN'] } },
  { path: 'partners-list', component: PartnersListComponent, canActivate: [authGuard], data: { roles: ['ROLE_CONSEILLER', 'ROLE_LOGISTICIEN'] } },
  { path: 'assistance-requests-cli', component: AssistanceRequestListComponent, canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] },},
  { path: 'assistance-requests-cons', component: AssistanceRequestsConsComponent, canActivate: [authGuard], data: { roles: ['ROLE_CONSEILLER'] },},
  { path: 'assistance-requests-logis', component: AssistanceRequestsLogisComponent, canActivate: [authGuard], data: { roles: ['ROLE_LOGISTICIEN'] } },
  { path: 'assistance-requests-part', component: AssistanceRequestsPartComponent, canActivate: [authGuard], data: { roles: ['ROLE_PARTENAIRE'] } },
  { path: 'sub-partners-list-part', component: SubPartnersListPartComponent, canActivate: [authGuard], data: { roles: ['ROLE_PARTENAIRE'] } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/error-page' },
];

export const appConfig = [
  ReactiveFormsModule,
  MatDialogModule
];
