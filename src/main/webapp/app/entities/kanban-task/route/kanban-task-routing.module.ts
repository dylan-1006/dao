import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KanbanTaskComponent } from '../list/kanban-task.component';
import { KanbanTaskDetailComponent } from '../detail/kanban-task-detail.component';
import { KanbanTaskUpdateComponent } from '../update/kanban-task-update.component';
import { KanbanTaskRoutingResolveService } from './kanban-task-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const kanbanTaskRoute: Routes = [
  {
    path: '',
    component: KanbanTaskComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: KanbanTaskDetailComponent,
    resolve: {
      kanbanTask: KanbanTaskRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: KanbanTaskUpdateComponent,
    resolve: {
      kanbanTask: KanbanTaskRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: KanbanTaskUpdateComponent,
    resolve: {
      kanbanTask: KanbanTaskRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(kanbanTaskRoute)],
  exports: [RouterModule],
})
export class KanbanTaskRoutingModule {}
