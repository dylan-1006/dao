import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { PrivacyPolicyMainScreenComponent } from './privacy-policy-main-screen.component';
import { PRIVACY_POLICY_MAIN_SCREEN_ROUTE } from './privacy-policy-main-screen.route';
import { NavbarComponent } from '../../layouts/navbar/navbar.component';
import { NavbarModule } from '../../layouts/navbar/navbar.module';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([PRIVACY_POLICY_MAIN_SCREEN_ROUTE]), NavbarModule],
  declarations: [PrivacyPolicyMainScreenComponent],
  exports: [NavbarComponent],
})
export class PrivacyPolicyMainScreenModule {}
