import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KanbanBoardComponent } from './list/kanban-board.component';
import { KanbanBoardDetailComponent } from './detail/kanban-board-detail.component';
import { KanbanBoardUpdateComponent } from './update/kanban-board-update.component';
import { KanbanBoardDeleteDialogComponent } from './delete/kanban-board-delete-dialog.component';
import { KanbanBoardRoutingModule } from './route/kanban-board-routing.module';

@NgModule({
  imports: [SharedModule, KanbanBoardRoutingModule],
  declarations: [KanbanBoardComponent, KanbanBoardDetailComponent, KanbanBoardUpdateComponent, KanbanBoardDeleteDialogComponent],
})
export class KanbanBoardModule {}
