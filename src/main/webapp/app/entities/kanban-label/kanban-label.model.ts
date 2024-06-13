import { IKanbanBoard } from 'app/entities/kanban-board/kanban-board.model';
import { IKanbanTask } from 'app/entities/kanban-task/kanban-task.model';

export interface IKanbanLabel {
  id: number;
  name?: string | null;
  colour?: string | null;
  boards?: Pick<IKanbanBoard, 'id'>[] | null;
  tasks?: Pick<IKanbanTask, 'id'>[] | null;
}

export type NewKanbanLabel = Omit<IKanbanLabel, 'id'> & { id: null };
