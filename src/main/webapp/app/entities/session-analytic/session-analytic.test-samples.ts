import { ISessionAnalytic, NewSessionAnalytic } from './session-analytic.model';

export const sampleWithRequiredData: ISessionAnalytic = {
  id: 30136,
};

export const sampleWithPartialData: ISessionAnalytic = {
  id: 79323,
  sessionDuration: 31997,
  pointsGained: 27931,
  praiseCount: 23003,
};

export const sampleWithFullData: ISessionAnalytic = {
  id: 85371,
  sessionDuration: 66077,
  taskTotal: 28081,
  taskCompleted: 84042,
  pointsGained: 86259,
  numOfPomodoroFinished: 1883,
  praiseCount: 4769,
};

export const sampleWithNewData: NewSessionAnalytic = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
