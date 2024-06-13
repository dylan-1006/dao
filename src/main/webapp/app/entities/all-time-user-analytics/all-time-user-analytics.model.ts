import dayjs from 'dayjs/esm';

export interface IAllTimeUserAnalytics {
  id: number;
  totalStudyTime?: number | null;
  totalPomodoroSession?: number | null;
  dailyStreaks?: number | null;
  mostFocusedPeriod?: dayjs.Dayjs | null;
  taskCompletionRate?: number | null;
  averageFocusDuration?: number | null;
  focusCount?: number | null;
  totalFocusDuration?: number | null;
  sessionRecord?: number | null;
  totalBreakTime?: number | null;
  averageBreakDuration?: number | null;
}

export type NewAllTimeUserAnalytics = Omit<IAllTimeUserAnalytics, 'id'> & { id: null };
