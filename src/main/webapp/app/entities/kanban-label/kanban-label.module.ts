import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KanbanLabelComponent } from './list/kanban-label.component';
import { KanbanLabelDetailComponent } from './detail/kanban-label-detail.component';
import { KanbanLabelUpdateComponent } from './update/kanban-label-update.component';
import { KanbanLabelDeleteDialogComponent } from './delete/kanban-label-delete-dialog.component';
import { KanbanLabelRoutingModule } from './route/kanban-label-routing.module';

@NgModule({
  imports: [SharedModule, KanbanLabelRoutingModule],
  declarations: [KanbanLabelComponent, KanbanLabelDetailComponent, KanbanLabelUpdateComponent, KanbanLabelDeleteDialogComponent],
})
export class KanbanLabelModule {}
