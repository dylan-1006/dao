import { IUser } from 'app/entities/user/user.model';
import { IAllTimeUserAnalytics } from 'app/entities/all-time-user-analytics/all-time-user-analytics.model';
import { IMilestone } from 'app/entities/milestone/milestone.model';
import { IKanbanTask } from 'app/entities/kanban-task/kanban-task.model';
import { ISession } from 'app/entities/session/session.model';

export interface IApplicationUser {
  id: number;
  internalUser?: Pick<IUser, 'id' | 'login'> | null;
  allTimeAnalytics?: Pick<IAllTimeUserAnalytics, 'id'> | null;
  currentMilestone?: Pick<IMilestone, 'id'> | null;
  kanbanTask?: Pick<IKanbanTask, 'id'> | null;
  session?: Pick<ISession, 'id'> | null;
}

export type NewApplicationUser = Omit<IApplicationUser, 'id'> & { id: null };
