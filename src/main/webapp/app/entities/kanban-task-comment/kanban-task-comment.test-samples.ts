import dayjs from 'dayjs/esm';

import { IKanbanTaskComment, NewKanbanTaskComment } from './kanban-task-comment.model';

export const sampleWithRequiredData: IKanbanTaskComment = {
  id: 42890,
};

export const sampleWithPartialData: IKanbanTaskComment = {
  id: 20669,
};

export const sampleWithFullData: IKanbanTaskComment = {
  id: 53164,
  content: 'Credit',
  timeStamp: dayjs('2024-03-09T21:09'),
};

export const sampleWithNewData: NewKanbanTaskComment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
