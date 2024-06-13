import dayjs from 'dayjs/esm';

import { IAllTimeUserAnalytics, NewAllTimeUserAnalytics } from './all-time-user-analytics.model';

export const sampleWithRequiredData: IAllTimeUserAnalytics = {
  id: 14114,
};

export const sampleWithPartialData: IAllTimeUserAnalytics = {
  id: 35090,
  totalStudyTime: 50516,
  totalPomodoroSession: 55274,
  dailyStreaks: 51199,
  mostFocusedPeriod: dayjs('2024-03-09T13:06'),
  focusCount: 58552,
  totalFocusDuration: 89747,
  totalBreakTime: 75558,
  averageBreakDuration: 27980,
};

export const sampleWithFullData: IAllTimeUserAnalytics = {
  id: 25863,
  totalStudyTime: 56007,
  totalPomodoroSession: 94564,
  dailyStreaks: 3053,
  mostFocusedPeriod: dayjs('2024-03-09T15:44'),
  taskCompletionRate: 10445,
  averageFocusDuration: 38542,
  focusCount: 36329,
  totalFocusDuration: 54224,
  sessionRecord: 88325,
  totalBreakTime: 84076,
  averageBreakDuration: 83429,
};

export const sampleWithNewData: NewAllTimeUserAnalytics = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
