import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMilestone } from '../milestone.model';
import { MilestoneService } from '../service/milestone.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './milestone-delete-dialog.component.html',
})
export class MilestoneDeleteDialogComponent {
  milestone?: IMilestone;

  constructor(protected milestoneService: MilestoneService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.milestoneService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
