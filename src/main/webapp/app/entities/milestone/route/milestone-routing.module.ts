import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MilestoneComponent } from '../list/milestone.component';
import { MilestoneDetailComponent } from '../detail/milestone-detail.component';
import { MilestoneUpdateComponent } from '../update/milestone-update.component';
import { MilestoneRoutingResolveService } from './milestone-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const milestoneRoute: Routes = [
  {
    path: '',
    component: MilestoneComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MilestoneDetailComponent,
    resolve: {
      milestone: MilestoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MilestoneUpdateComponent,
    resolve: {
      milestone: MilestoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MilestoneUpdateComponent,
    resolve: {
      milestone: MilestoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(milestoneRoute)],
  exports: [RouterModule],
})
export class MilestoneRoutingModule {}
