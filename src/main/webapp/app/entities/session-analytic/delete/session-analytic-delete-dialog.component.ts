import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISessionAnalytic } from '../session-analytic.model';
import { SessionAnalyticService } from '../service/session-analytic.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './session-analytic-delete-dialog.component.html',
})
export class SessionAnalyticDeleteDialogComponent {
  sessionAnalytic?: ISessionAnalytic;

  constructor(protected sessionAnalyticService: SessionAnalyticService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sessionAnalyticService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
