import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPomodoroTimer } from '../pomodoro-timer.model';
import { PomodoroTimerService } from '../service/pomodoro-timer.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './pomodoro-timer-delete-dialog.component.html',
})
export class PomodoroTimerDeleteDialogComponent {
  pomodoroTimer?: IPomodoroTimer;

  constructor(protected pomodoroTimerService: PomodoroTimerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pomodoroTimerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
