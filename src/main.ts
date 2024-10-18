/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { SubscriptionFormComponent } from './app/subscription-form/subscription-form.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
