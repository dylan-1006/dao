import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PraiseComponent } from '../list/praise.component';
import { PraiseDetailComponent } from '../detail/praise-detail.component';
import { PraiseUpdateComponent } from '../update/praise-update.component';
import { PraiseRoutingResolveService } from './praise-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const praiseRoute: Routes = [
  {
    path: '',
    component: PraiseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PraiseDetailComponent,
    resolve: {
      praise: PraiseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PraiseUpdateComponent,
    resolve: {
      praise: PraiseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PraiseUpdateComponent,
    resolve: {
      praise: PraiseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(praiseRoute)],
  exports: [RouterModule],
})
export class PraiseRoutingModule {}
