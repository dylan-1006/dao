import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { NavbarComponent } from '../layouts/navbar/navbar.component';
import { NavbarModule } from '../layouts/navbar/navbar.module';
import { ApplicationUserManager } from './applicationUserManager';
import { WelcomeMessageComponent } from './welcome-message/welcome-message.component';
import { NewSessionFormComponent } from './new-session-form/new-session-form-component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE]), NavbarModule, FormsModule, MatIconModule],
  declarations: [HomeComponent, WelcomeMessageComponent, NewSessionFormComponent],
  exports: [NavbarComponent],
  providers: [ApplicationUserManager],
})
export class HomeModule {}
