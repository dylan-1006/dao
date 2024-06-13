import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { IAllTimeUserAnalytics } from 'app/entities/all-time-user-analytics/all-time-user-analytics.model';

export interface ISessionAnalytic {
  id: number;
  sessionDuration?: number | null;
  taskTotal?: number | null;
  taskCompleted?: number | null;
  pointsGained?: number | null;
  numOfPomodoroFinished?: number | null;
  praiseCount?: number | null;
  user?: Pick<IApplicationUser, 'id'> | null;
  allTimeUserAnalytics?: Pick<IAllTimeUserAnalytics, 'id'> | null;
}

export type NewSessionAnalytic = Omit<ISessionAnalytic, 'id'> & { id: null };
