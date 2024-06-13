import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AllTimeUserAnalyticsComponent } from '../list/all-time-user-analytics.component';
import { AllTimeUserAnalyticsDetailComponent } from '../detail/all-time-user-analytics-detail.component';
import { AllTimeUserAnalyticsUpdateComponent } from '../update/all-time-user-analytics-update.component';
import { AllTimeUserAnalyticsRoutingResolveService } from './all-time-user-analytics-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const allTimeUserAnalyticsRoute: Routes = [
  {
    path: '',
    component: AllTimeUserAnalyticsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AllTimeUserAnalyticsDetailComponent,
    resolve: {
      allTimeUserAnalytics: AllTimeUserAnalyticsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AllTimeUserAnalyticsUpdateComponent,
    resolve: {
      allTimeUserAnalytics: AllTimeUserAnalyticsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AllTimeUserAnalyticsUpdateComponent,
    resolve: {
      allTimeUserAnalytics: AllTimeUserAnalyticsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(allTimeUserAnalyticsRoute)],
  exports: [RouterModule],
})
export class AllTimeUserAnalyticsRoutingModule {}
