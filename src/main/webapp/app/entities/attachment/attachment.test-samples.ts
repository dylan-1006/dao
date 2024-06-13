import { AttachmentType } from 'app/entities/enumerations/attachment-type.model';

import { IAttachment, NewAttachment } from './attachment.model';

export const sampleWithRequiredData: IAttachment = {
  id: 43624,
};

export const sampleWithPartialData: IAttachment = {
  id: 68016,
  fileUrl: 'user-facing Buckinghamshire',
  type: AttachmentType['VIDEO'],
};

export const sampleWithFullData: IAttachment = {
  id: 47290,
  filename: 'deposit',
  fileUrl: 'Product capacitor Central',
  type: AttachmentType['DOCUMENT'],
};

export const sampleWithNewData: NewAttachment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
