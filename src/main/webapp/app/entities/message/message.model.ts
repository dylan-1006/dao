import dayjs from 'dayjs/esm';
import { IAttachment } from 'app/entities/attachment/attachment.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ISession } from 'app/entities/session/session.model';
import { MessageStatus } from 'app/entities/enumerations/message-status.model';

export interface IMessage {
  id: number;
  content?: string | null;
  sentTime?: dayjs.Dayjs | null;
  status?: MessageStatus | null;
  hasAttachment?: boolean | null;
  isPinned?: boolean | null;
  attachment?: Pick<IAttachment, 'id'> | null;
  applicationUser?: Pick<IApplicationUser, 'id'> | null;
  session?: Pick<ISession, 'id'> | null;
}

export type NewMessage = Omit<IMessage, 'id'> & { id: null };
