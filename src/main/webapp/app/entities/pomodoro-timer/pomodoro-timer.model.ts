import dayjs from 'dayjs/esm';
import { TimerState } from 'app/entities/enumerations/timer-state.model';
import { TimerType } from 'app/entities/enumerations/timer-type.model';

export interface IPomodoroTimer {
  id: number;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  state?: TimerState | null;
  type?: TimerType | null;
  duration?: string | null;
}

export type NewPomodoroTimer = Omit<IPomodoroTimer, 'id'> & { id: null };
