import { AttachmentType } from 'app/entities/enumerations/attachment-type.model';

export interface IAttachment {
  id: number;
  filename?: string | null;
  fileUrl?: string | null;
  type?: AttachmentType | null;
}

export type NewAttachment = Omit<IAttachment, 'id'> & { id: null };
