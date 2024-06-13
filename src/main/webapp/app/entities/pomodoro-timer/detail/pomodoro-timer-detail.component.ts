import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPomodoroTimer } from '../pomodoro-timer.model';

@Component({
  selector: 'jhi-pomodoro-timer-detail',
  templateUrl: './pomodoro-timer-detail.component.html',
})
export class PomodoroTimerDetailComponent implements OnInit {
  pomodoroTimer: IPomodoroTimer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pomodoroTimer }) => {
      this.pomodoroTimer = pomodoroTimer;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
