import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KanbanTaskCommentComponent } from '../list/kanban-task-comment.component';
import { KanbanTaskCommentDetailComponent } from '../detail/kanban-task-comment-detail.component';
import { KanbanTaskCommentUpdateComponent } from '../update/kanban-task-comment-update.component';
import { KanbanTaskCommentRoutingResolveService } from './kanban-task-comment-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const kanbanTaskCommentRoute: Routes = [
  {
    path: '',
    component: KanbanTaskCommentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: KanbanTaskCommentDetailComponent,
    resolve: {
      kanbanTaskComment: KanbanTaskCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: KanbanTaskCommentUpdateComponent,
    resolve: {
      kanbanTaskComment: KanbanTaskCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: KanbanTaskCommentUpdateComponent,
    resolve: {
      kanbanTaskComment: KanbanTaskCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(kanbanTaskCommentRoute)],
  exports: [RouterModule],
})
export class KanbanTaskCommentRoutingModule {}
