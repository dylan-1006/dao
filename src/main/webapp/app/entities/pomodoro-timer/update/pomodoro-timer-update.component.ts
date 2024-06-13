import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PomodoroTimerFormService, PomodoroTimerFormGroup } from './pomodoro-timer-form.service';
import { IPomodoroTimer } from '../pomodoro-timer.model';
import { PomodoroTimerService } from '../service/pomodoro-timer.service';
import { TimerState } from 'app/entities/enumerations/timer-state.model';
import { TimerType } from 'app/entities/enumerations/timer-type.model';

@Component({
  selector: 'jhi-pomodoro-timer-update',
  templateUrl: './pomodoro-timer-update.component.html',
})
export class PomodoroTimerUpdateComponent implements OnInit {
  isSaving = false;
  pomodoroTimer: IPomodoroTimer | null = null;
  timerStateValues = Object.keys(TimerState);
  timerTypeValues = Object.keys(TimerType);

  editForm: PomodoroTimerFormGroup = this.pomodoroTimerFormService.createPomodoroTimerFormGroup();

  constructor(
    protected pomodoroTimerService: PomodoroTimerService,
    protected pomodoroTimerFormService: PomodoroTimerFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pomodoroTimer }) => {
      this.pomodoroTimer = pomodoroTimer;
      if (pomodoroTimer) {
        this.updateForm(pomodoroTimer);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pomodoroTimer = this.pomodoroTimerFormService.getPomodoroTimer(this.editForm);
    if (pomodoroTimer.id !== null) {
      this.subscribeToSaveResponse(this.pomodoroTimerService.update(pomodoroTimer));
    } else {
      this.subscribeToSaveResponse(this.pomodoroTimerService.create(pomodoroTimer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPomodoroTimer>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(pomodoroTimer: IPomodoroTimer): void {
    this.pomodoroTimer = pomodoroTimer;
    this.pomodoroTimerFormService.resetForm(this.editForm, pomodoroTimer);
  }
}
