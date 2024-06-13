import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMessage, NewMessage } from '../message.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMessage for edit and NewMessageFormGroupInput for create.
 */
type MessageFormGroupInput = IMessage | PartialWithRequiredKeyOf<NewMessage>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IMessage | NewMessage> = Omit<T, 'sentTime'> & {
  sentTime?: string | null;
};

type MessageFormRawValue = FormValueOf<IMessage>;

type NewMessageFormRawValue = FormValueOf<NewMessage>;

type MessageFormDefaults = Pick<NewMessage, 'id' | 'sentTime' | 'hasAttachment' | 'isPinned'>;

type MessageFormGroupContent = {
  id: FormControl<MessageFormRawValue['id'] | NewMessage['id']>;
  content: FormControl<MessageFormRawValue['content']>;
  sentTime: FormControl<MessageFormRawValue['sentTime']>;
  status: FormControl<MessageFormRawValue['status']>;
  hasAttachment: FormControl<MessageFormRawValue['hasAttachment']>;
  isPinned: FormControl<MessageFormRawValue['isPinned']>;
  attachment: FormControl<MessageFormRawValue['attachment']>;
  applicationUser: FormControl<MessageFormRawValue['applicationUser']>;
  session: FormControl<MessageFormRawValue['session']>;
};

export type MessageFormGroup = FormGroup<MessageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MessageFormService {
  createMessageFormGroup(message: MessageFormGroupInput = { id: null }): MessageFormGroup {
    const messageRawValue = this.convertMessageToMessageRawValue({
      ...this.getFormDefaults(),
      ...message,
    });
    return new FormGroup<MessageFormGroupContent>({
      id: new FormControl(
        { value: messageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      content: new FormControl(messageRawValue.content),
      sentTime: new FormControl(messageRawValue.sentTime),
      status: new FormControl(messageRawValue.status),
      hasAttachment: new FormControl(messageRawValue.hasAttachment),
      isPinned: new FormControl(messageRawValue.isPinned),
      attachment: new FormControl(messageRawValue.attachment),
      applicationUser: new FormControl(messageRawValue.applicationUser),
      session: new FormControl(messageRawValue.session),
    });
  }

  getMessage(form: MessageFormGroup): IMessage | NewMessage {
    return this.convertMessageRawValueToMessage(form.getRawValue() as MessageFormRawValue | NewMessageFormRawValue);
  }

  resetForm(form: MessageFormGroup, message: MessageFormGroupInput): void {
    const messageRawValue = this.convertMessageToMessageRawValue({ ...this.getFormDefaults(), ...message });
    form.reset(
      {
        ...messageRawValue,
        id: { value: messageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MessageFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      sentTime: currentTime,
      hasAttachment: false,
      isPinned: false,
    };
  }

  private convertMessageRawValueToMessage(rawMessage: MessageFormRawValue | NewMessageFormRawValue): IMessage | NewMessage {
    return {
      ...rawMessage,
      sentTime: dayjs(rawMessage.sentTime, DATE_TIME_FORMAT),
    };
  }

  private convertMessageToMessageRawValue(
    message: IMessage | (Partial<NewMessage> & MessageFormDefaults)
  ): MessageFormRawValue | PartialWithRequiredKeyOf<NewMessageFormRawValue> {
    return {
      ...message,
      sentTime: message.sentTime ? message.sentTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
