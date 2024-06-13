import { Route } from '@angular/router';

import { FocusSessionMainScreenComponent } from './focus-session-main-screen.component';

export const FOCUS_SESSION_MAIN_SCREEN_ROUTE: Route = {
  path: '',
  component: FocusSessionMainScreenComponent,
  data: {
    pageTitle: 'Focus Session',
  },
};
