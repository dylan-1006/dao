import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKanbanTaskComment } from '../kanban-task-comment.model';
import { KanbanTaskCommentService } from '../service/kanban-task-comment.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './kanban-task-comment-delete-dialog.component.html',
})
export class KanbanTaskCommentDeleteDialogComponent {
  kanbanTaskComment?: IKanbanTaskComment;

  constructor(protected kanbanTaskCommentService: KanbanTaskCommentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.kanbanTaskCommentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
