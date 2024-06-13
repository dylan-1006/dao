import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { navbarRoute } from './navbar.route';
import { NavbarComponent } from './navbar.component';
import { ApplicationUserManager } from '../../home/applicationUserManager';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([navbarRoute])],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
  providers: [ApplicationUserManager],
})
export class NavbarModule {}
