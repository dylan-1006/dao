import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PomodoroTimerComponent } from '../list/pomodoro-timer.component';
import { PomodoroTimerDetailComponent } from '../detail/pomodoro-timer-detail.component';
import { PomodoroTimerUpdateComponent } from '../update/pomodoro-timer-update.component';
import { PomodoroTimerRoutingResolveService } from './pomodoro-timer-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const pomodoroTimerRoute: Routes = [
  {
    path: '',
    component: PomodoroTimerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PomodoroTimerDetailComponent,
    resolve: {
      pomodoroTimer: PomodoroTimerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PomodoroTimerUpdateComponent,
    resolve: {
      pomodoroTimer: PomodoroTimerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PomodoroTimerUpdateComponent,
    resolve: {
      pomodoroTimer: PomodoroTimerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pomodoroTimerRoute)],
  exports: [RouterModule],
})
export class PomodoroTimerRoutingModule {}
