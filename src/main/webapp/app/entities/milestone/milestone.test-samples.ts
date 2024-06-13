import { IMilestone, NewMilestone } from './milestone.model';

export const sampleWithRequiredData: IMilestone = {
  id: 23078,
};

export const sampleWithPartialData: IMilestone = {
  id: 6092,
  requiredHours: 23186,
  achievements: 'Director streamline',
};

export const sampleWithFullData: IMilestone = {
  id: 97310,
  requiredHours: 35213,
  achievements: 'Marks Place Representative',
};

export const sampleWithNewData: NewMilestone = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
