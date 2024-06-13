import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PomodoroTimerComponent } from './list/pomodoro-timer.component';
import { PomodoroTimerDetailComponent } from './detail/pomodoro-timer-detail.component';
import { PomodoroTimerUpdateComponent } from './update/pomodoro-timer-update.component';
import { PomodoroTimerDeleteDialogComponent } from './delete/pomodoro-timer-delete-dialog.component';
import { PomodoroTimerRoutingModule } from './route/pomodoro-timer-routing.module';

@NgModule({
  imports: [SharedModule, PomodoroTimerRoutingModule],
  declarations: [PomodoroTimerComponent, PomodoroTimerDetailComponent, PomodoroTimerUpdateComponent, PomodoroTimerDeleteDialogComponent],
})
export class PomodoroTimerModule {}
