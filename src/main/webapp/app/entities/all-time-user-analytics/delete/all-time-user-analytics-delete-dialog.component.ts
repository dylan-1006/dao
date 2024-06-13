import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAllTimeUserAnalytics } from '../all-time-user-analytics.model';
import { AllTimeUserAnalyticsService } from '../service/all-time-user-analytics.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './all-time-user-analytics-delete-dialog.component.html',
})
export class AllTimeUserAnalyticsDeleteDialogComponent {
  allTimeUserAnalytics?: IAllTimeUserAnalytics;

  constructor(protected allTimeUserAnalyticsService: AllTimeUserAnalyticsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.allTimeUserAnalyticsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
