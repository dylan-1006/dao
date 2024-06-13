import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KanbanBoardComponent } from '../list/kanban-board.component';
import { KanbanBoardDetailComponent } from '../detail/kanban-board-detail.component';
import { KanbanBoardUpdateComponent } from '../update/kanban-board-update.component';
import { KanbanBoardRoutingResolveService } from './kanban-board-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const kanbanBoardRoute: Routes = [
  {
    path: '',
    component: KanbanBoardComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: KanbanBoardDetailComponent,
    resolve: {
      kanbanBoard: KanbanBoardRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: KanbanBoardUpdateComponent,
    resolve: {
      kanbanBoard: KanbanBoardRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: KanbanBoardUpdateComponent,
    resolve: {
      kanbanBoard: KanbanBoardRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(kanbanBoardRoute)],
  exports: [RouterModule],
})
export class KanbanBoardRoutingModule {}
