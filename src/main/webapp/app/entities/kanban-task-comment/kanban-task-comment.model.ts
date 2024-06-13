import dayjs from 'dayjs/esm';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { IKanbanTask } from 'app/entities/kanban-task/kanban-task.model';

export interface IKanbanTaskComment {
  id: number;
  content?: string | null;
  timeStamp?: dayjs.Dayjs | null;
  author?: Pick<IApplicationUser, 'id'> | null;
  kanbanTask?: Pick<IKanbanTask, 'id'> | null;
}

export type NewKanbanTaskComment = Omit<IKanbanTaskComment, 'id'> & { id: null };
