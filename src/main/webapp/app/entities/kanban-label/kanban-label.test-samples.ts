import { IKanbanLabel, NewKanbanLabel } from './kanban-label.model';

export const sampleWithRequiredData: IKanbanLabel = {
  id: 26009,
};

export const sampleWithPartialData: IKanbanLabel = {
  id: 46451,
};

export const sampleWithFullData: IKanbanLabel = {
  id: 7143,
  name: 'mission-critical Corporate Lari',
  colour: '#Cd1d7A',
};

export const sampleWithNewData: NewKanbanLabel = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
