import dayjs from 'dayjs/esm';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { IKanbanLabel } from 'app/entities/kanban-label/kanban-label.model';
import { IKanbanBoard } from 'app/entities/kanban-board/kanban-board.model';
import { TaskStatus } from 'app/entities/enumerations/task-status.model';

export interface IKanbanTask {
  id: number;
  title?: string | null;
  description?: string | null;
  taskStatus?: TaskStatus | null;
  dueDate?: dayjs.Dayjs | null;
  author?: Pick<IApplicationUser, 'id'> | null;
  labels?: Pick<IKanbanLabel, 'id' | 'colour' | 'name'>[] | null;
  kanbanBoard?: Pick<IKanbanBoard, 'id'> | null;
}

export type NewKanbanTask = Omit<IKanbanTask, 'id'> & { id: null };
