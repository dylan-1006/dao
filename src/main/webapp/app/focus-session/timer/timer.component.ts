import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FontSizeService } from '../../shared/font-size.service';
import { ISession } from '../../entities/session/session.model';
import { IPomodoroTimer } from '../../entities/pomodoro-timer/pomodoro-timer.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'jhi-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  @Input() currentSession: ISession | null = null;
  sessionId = this.currentSession?.id.toString();
  timerId: number | undefined = this.currentSession?.pomodoroTimer?.id;
  pomodoroTimer!: IPomodoroTimer;
  currentTimer: IPomodoroTimer | null | undefined = null;
  buttons!: NodeListOf<Element>;
  focusBtn!: HTMLElement;
  shortBreakBtn!: HTMLElement;
  longBreakBtn!: HTMLElement;
  startBtn!: HTMLElement;
  pause!: HTMLElement;
  reset!: HTMLElement;
  time!: HTMLElement;
  set: number | undefined;
  active: 'focus' | 'short' | 'long' = 'focus';
  count = 59;
  paused: true | false = true;
  minCount = 24;
  fsValue = 'fs-1';

  constructor(private http: HttpClient, private elementRef: ElementRef, private fontSizeService: FontSizeService) {
    this.fontSizeService.fsSubject.subscribe((fontSize: string) => {
      this.fsValue = fontSize; // Update the font size value
    });
  }

  ngOnInit(): void {
    this.buttons = document.querySelectorAll('.btn');
    this.focusBtn = document.getElementById('pomodoroTimer')!;
    this.shortBreakBtn = document.getElementById('shortBreak')!;
    this.longBreakBtn = document.getElementById('longBreak')!;
    this.startBtn = document.getElementById('btn-start')!;
    this.pause = document.getElementById('btn-pause')!;
    this.reset = document.getElementById('btn-reset')!;
    this.time = document.getElementById('time')!;
    this.time.textContent = `${this.minCount + 1}:00`;

    this.reset.addEventListener('click', () => {
      this.pauseTimer();
      switch (this.active) {
        case 'long':
          this.minCount = 9;
          break;
        case 'short':
          this.minCount = 4;
          break;
        default:
          this.minCount = 24;
      }
      this.count = 59;
      this.time.textContent = `${this.minCount + 1}:00`;
    });

    this.focusBtn.addEventListener('click', () => {
      this.removeFocus();
      this.active = 'focus';
      this.focusBtn.classList.add('btn-start');
      this.pauseTimer();
      this.minCount = 24;
      this.count = 59;
      this.time.textContent = `${this.minCount + 1}:00`;
    });

    this.shortBreakBtn.addEventListener('click', () => {
      this.active = 'short';
      this.removeFocus();
      this.shortBreakBtn.classList.add('btn-start');
      this.pauseTimer();
      this.minCount = 4;
      this.count = 59;
      this.time.textContent = `${this.appendZero(this.minCount + 1)}:00`;
    });

    this.longBreakBtn.addEventListener('click', () => {
      this.active = 'long';
      this.removeFocus();
      this.longBreakBtn.classList.add('btn-start');
      this.pauseTimer();
      this.minCount = 9;
      this.count = 59;
      this.time.textContent = `${this.minCount + 1}:00`;
    });

    this.pause.addEventListener('click', () => {
      this.paused = true;
      clearInterval(this.set);
      this.startBtn.classList.remove('hide');
      this.pause.classList.remove('show');
      this.reset.classList.remove('show');
    });

    this.startBtn.addEventListener('click', () => {
      this.startTimer();
    });

    if (this.currentSession) {
      this.sessionId = this.currentSession.id.toString();
      this.timerId = this.currentSession.pomodoroTimer?.id;
      this.fetchTimer();
    }
  }

  fetchTimer(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI5NjA1OH0._I9LvG0nrRF0tU9xoahRgPwpa1UQJWFKKgeh3bD7qklwDAyA1UxE7vB_d8l6gzMSPzEU9TzzSIxp2Qau7e_q_w'
    );

    this.http.get<IPomodoroTimer>(`api/pomodoro-timers/${this.timerId}`, { headers }).subscribe(currentTimer => {
      this.currentTimer = currentTimer;
    });
  }

  appendZero = (value: number): string => (value < 10 ? `0${value}` : value.toString());

  pauseTimer(): void {
    if (!this.paused) {
      this.paused = true;
      clearInterval(this.set);
      this.startBtn.classList.remove('hide');
      this.pause.classList.remove('show');
      this.reset.classList.remove('show');
    }
  }

  startTimer(): void {
    this.reset.classList.add('show');
    this.pause.classList.add('show');
    this.startBtn.classList.add('hide');
    this.startBtn.classList.remove('show');
    if (this.paused) {
      this.paused = false;
      this.time.textContent = `${this.appendZero(this.minCount)}:${this.appendZero(this.count)}`;
      this.set = setInterval(() => {
        this.count--;
        this.time.textContent = `${this.appendZero(this.minCount)}:${this.appendZero(this.count)}`;
        if (this.count === 0) {
          if (this.minCount !== 0) {
            this.minCount--;
            this.count = 60;
          } else {
            clearInterval(this.set);

            this.active = 'focus';
            this.removeFocus();
            this.focusBtn.classList.add('btn-start');
            this.minCount = 24; // Focus session duration
            this.count = 59;
            this.time.textContent = `${this.minCount + 1}:00`;
          }
        }
      }, 1000);
    }
  }

  removeFocus(): void {
    this.buttons.forEach(btn => btn.classList.remove('btn-start'));
  }
}
