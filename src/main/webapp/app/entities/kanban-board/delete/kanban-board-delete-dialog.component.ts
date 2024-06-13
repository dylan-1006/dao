import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKanbanBoard } from '../kanban-board.model';
import { KanbanBoardService } from '../service/kanban-board.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './kanban-board-delete-dialog.component.html',
})
export class KanbanBoardDeleteDialogComponent {
  kanbanBoard?: IKanbanBoard;

  constructor(protected kanbanBoardService: KanbanBoardService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.kanbanBoardService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
