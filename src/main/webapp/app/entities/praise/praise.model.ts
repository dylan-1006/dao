import { IApplicationUser } from 'app/entities/application-user/application-user.model';

export interface IPraise {
  id: number;
  praiseMessage?: string | null;
  sender?: Pick<IApplicationUser, 'id'> | null;
  receiver?: Pick<IApplicationUser, 'id'> | null;
}

export type NewPraise = Omit<IPraise, 'id'> & { id: null };
