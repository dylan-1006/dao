import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SessionAnalyticComponent } from '../list/session-analytic.component';
import { SessionAnalyticDetailComponent } from '../detail/session-analytic-detail.component';
import { SessionAnalyticUpdateComponent } from '../update/session-analytic-update.component';
import { SessionAnalyticRoutingResolveService } from './session-analytic-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const sessionAnalyticRoute: Routes = [
  {
    path: '',
    component: SessionAnalyticComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SessionAnalyticDetailComponent,
    resolve: {
      sessionAnalytic: SessionAnalyticRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SessionAnalyticUpdateComponent,
    resolve: {
      sessionAnalytic: SessionAnalyticRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SessionAnalyticUpdateComponent,
    resolve: {
      sessionAnalytic: SessionAnalyticRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sessionAnalyticRoute)],
  exports: [RouterModule],
})
export class SessionAnalyticRoutingModule {}
