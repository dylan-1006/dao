import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KanbanTaskComponent } from './list/kanban-task.component';
import { KanbanTaskDetailComponent } from './detail/kanban-task-detail.component';
import { KanbanTaskUpdateComponent } from './update/kanban-task-update.component';
import { KanbanTaskDeleteDialogComponent } from './delete/kanban-task-delete-dialog.component';
import { KanbanTaskRoutingModule } from './route/kanban-task-routing.module';

@NgModule({
  imports: [SharedModule, KanbanTaskRoutingModule],
  declarations: [KanbanTaskComponent, KanbanTaskDetailComponent, KanbanTaskUpdateComponent, KanbanTaskDeleteDialogComponent],
})
export class KanbanTaskModule {}
