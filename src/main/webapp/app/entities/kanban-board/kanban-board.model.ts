import { IKanbanLabel } from 'app/entities/kanban-label/kanban-label.model';

export interface IKanbanBoard {
  id: number;
  title?: string | null;
  description?: string | null;
  labels?: Pick<IKanbanLabel, 'id'>[] | null;
}

export type NewKanbanBoard = Omit<IKanbanBoard, 'id'> & { id: null };
