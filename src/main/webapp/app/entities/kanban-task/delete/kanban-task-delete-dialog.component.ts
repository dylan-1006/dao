import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKanbanTask } from '../kanban-task.model';
import { KanbanTaskService } from '../service/kanban-task.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './kanban-task-delete-dialog.component.html',
})
export class KanbanTaskDeleteDialogComponent {
  kanbanTask?: IKanbanTask;

  constructor(protected kanbanTaskService: KanbanTaskService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.kanbanTaskService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
