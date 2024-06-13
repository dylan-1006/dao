import dayjs from 'dayjs/esm';

import { MessageStatus } from 'app/entities/enumerations/message-status.model';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 29027,
};

export const sampleWithPartialData: IMessage = {
  id: 28491,
  content: 'Oklahoma',
  status: MessageStatus['DELIVERED'],
  isPinned: true,
};

export const sampleWithFullData: IMessage = {
  id: 76000,
  content: 'invoice',
  sentTime: dayjs('2024-03-09T03:29'),
  status: MessageStatus['DELIVERED'],
  hasAttachment: false,
  isPinned: true,
};

export const sampleWithNewData: NewMessage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
