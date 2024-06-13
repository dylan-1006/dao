import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KanbanTaskCommentComponent } from './list/kanban-task-comment.component';
import { KanbanTaskCommentDetailComponent } from './detail/kanban-task-comment-detail.component';
import { KanbanTaskCommentUpdateComponent } from './update/kanban-task-comment-update.component';
import { KanbanTaskCommentDeleteDialogComponent } from './delete/kanban-task-comment-delete-dialog.component';
import { KanbanTaskCommentRoutingModule } from './route/kanban-task-comment-routing.module';

@NgModule({
  imports: [SharedModule, KanbanTaskCommentRoutingModule],
  declarations: [
    KanbanTaskCommentComponent,
    KanbanTaskCommentDetailComponent,
    KanbanTaskCommentUpdateComponent,
    KanbanTaskCommentDeleteDialogComponent,
  ],
})
export class KanbanTaskCommentModule {}
