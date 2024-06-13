export interface IMilestone {
  id: number;
  requiredHours?: number | null;
  achievements?: string | null;
}

export type NewMilestone = Omit<IMilestone, 'id'> & { id: null };
