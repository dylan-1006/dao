import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KanbanLabelComponent } from '../list/kanban-label.component';
import { KanbanLabelDetailComponent } from '../detail/kanban-label-detail.component';
import { KanbanLabelUpdateComponent } from '../update/kanban-label-update.component';
import { KanbanLabelRoutingResolveService } from './kanban-label-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const kanbanLabelRoute: Routes = [
  {
    path: '',
    component: KanbanLabelComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: KanbanLabelDetailComponent,
    resolve: {
      kanbanLabel: KanbanLabelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: KanbanLabelUpdateComponent,
    resolve: {
      kanbanLabel: KanbanLabelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: KanbanLabelUpdateComponent,
    resolve: {
      kanbanLabel: KanbanLabelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(kanbanLabelRoute)],
  exports: [RouterModule],
})
export class KanbanLabelRoutingModule {}
