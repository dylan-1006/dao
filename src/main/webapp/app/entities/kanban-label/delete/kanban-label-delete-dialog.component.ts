import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKanbanLabel } from '../kanban-label.model';
import { KanbanLabelService } from '../service/kanban-label.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './kanban-label-delete-dialog.component.html',
})
export class KanbanLabelDeleteDialogComponent {
  kanbanLabel?: IKanbanLabel;

  constructor(protected kanbanLabelService: KanbanLabelService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.kanbanLabelService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
