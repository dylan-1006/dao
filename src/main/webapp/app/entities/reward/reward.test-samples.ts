import { IReward, NewReward } from './reward.model';

export const sampleWithRequiredData: IReward = {
  id: 66158,
};

export const sampleWithPartialData: IReward = {
  id: 49065,
  description: 'Incredible',
};

export const sampleWithFullData: IReward = {
  id: 96210,
  title: 'Granite Account',
  description: 'hard',
  rewardUrl: 'User Clothing',
};

export const sampleWithNewData: NewReward = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
