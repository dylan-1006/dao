import { IMilestone } from 'app/entities/milestone/milestone.model';

export interface IReward {
  id: number;
  title?: string | null;
  description?: string | null;
  rewardUrl?: string | null;
  milestone?: Pick<IMilestone, 'id'> | null;
}

export type NewReward = Omit<IReward, 'id'> & { id: null };
