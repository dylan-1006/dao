import dayjs from 'dayjs/esm';

import { TaskStatus } from 'app/entities/enumerations/task-status.model';

import { IKanbanTask, NewKanbanTask } from './kanban-task.model';

export const sampleWithRequiredData: IKanbanTask = {
  id: 37885,
};

export const sampleWithPartialData: IKanbanTask = {
  id: 89257,
  taskStatus: TaskStatus['IN_PROGRESS'],
  dueDate: dayjs('2024-03-09T20:35'),
};

export const sampleWithFullData: IKanbanTask = {
  id: 50127,
  title: 'Antillian access',
  description: 'Applications bifurcated Computer',
  taskStatus: TaskStatus['DONE'],
  dueDate: dayjs('2024-03-09T08:42'),
};

export const sampleWithNewData: NewKanbanTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
