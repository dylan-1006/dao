import dayjs from 'dayjs/esm';

import { ISession, NewSession } from './session.model';

export const sampleWithRequiredData: ISession = {
  id: 24252,
};

export const sampleWithPartialData: ISession = {
  id: 20495,
  title: 'User-friendly Berkshire gold',
  startTime: dayjs('2024-03-09T00:36'),
  endTime: dayjs('2024-03-09T03:32'),
};

export const sampleWithFullData: ISession = {
  id: 68157,
  title: 'full-range deposit',
  joinCode: 'Mouse Anguilla',
  userIdList: 'Optional',
  startTime: dayjs('2024-03-09T19:43'),
  endTime: dayjs('2024-03-09T15:26'),
};

export const sampleWithNewData: NewSession = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
