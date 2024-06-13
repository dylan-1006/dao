import { IPraise, NewPraise } from './praise.model';

export const sampleWithRequiredData: IPraise = {
  id: 79978,
};

export const sampleWithPartialData: IPraise = {
  id: 31141,
  praiseMessage: 'benchmark Kina Computers',
};

export const sampleWithFullData: IPraise = {
  id: 99163,
  praiseMessage: 'Landing Checking',
};

export const sampleWithNewData: NewPraise = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
