import { Route } from '@angular/router';
import { PrivacyPolicyMainScreenComponent } from './privacy-policy-main-screen.component';

export const PRIVACY_POLICY_MAIN_SCREEN_ROUTE: Route = {
  path: '',
  component: PrivacyPolicyMainScreenComponent,
  data: {
    pageTitle: 'Privacy Policy',
  },
};
