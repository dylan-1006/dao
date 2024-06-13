import dayjs from 'dayjs/esm';

import { TimerState } from 'app/entities/enumerations/timer-state.model';
import { TimerType } from 'app/entities/enumerations/timer-type.model';

import { IPomodoroTimer, NewPomodoroTimer } from './pomodoro-timer.model';

export const sampleWithRequiredData: IPomodoroTimer = {
  id: 22448,
};

export const sampleWithPartialData: IPomodoroTimer = {
  id: 14534,
  startTime: dayjs('2024-03-09T09:22'),
  type: TimerType['POMODORO_TIMER'],
};

export const sampleWithFullData: IPomodoroTimer = {
  id: 82222,
  startTime: dayjs('2024-03-09T15:26'),
  endTime: dayjs('2024-03-09T21:06'),
  state: TimerState['RESET'],
  type: TimerType['SHORT_BREAK_TIMER'],
  duration: '57771',
};

export const sampleWithNewData: NewPomodoroTimer = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
