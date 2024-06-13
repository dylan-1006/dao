import { IKanbanBoard, NewKanbanBoard } from './kanban-board.model';

export const sampleWithRequiredData: IKanbanBoard = {
  id: 80148,
};

export const sampleWithPartialData: IKanbanBoard = {
  id: 77475,
};

export const sampleWithFullData: IKanbanBoard = {
  id: 39300,
  title: 'Iraqi',
  description: 'matrix XML',
};

export const sampleWithNewData: NewKanbanBoard = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
