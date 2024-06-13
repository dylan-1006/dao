import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISession, NewSession } from '../session.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISession for edit and NewSessionFormGroupInput for create.
 */
type SessionFormGroupInput = ISession | PartialWithRequiredKeyOf<NewSession>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISession | NewSession> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

type SessionFormRawValue = FormValueOf<ISession>;

type NewSessionFormRawValue = FormValueOf<NewSession>;

type SessionFormDefaults = Pick<NewSession, 'id' | 'startTime' | 'endTime'>;

type SessionFormGroupContent = {
  id: FormControl<SessionFormRawValue['id'] | NewSession['id']>;
  title: FormControl<SessionFormRawValue['title']>;
  joinCode: FormControl<SessionFormRawValue['joinCode']>;
  userIdList: FormControl<SessionFormRawValue['userIdList']>;
  startTime: FormControl<SessionFormRawValue['startTime']>;
  endTime: FormControl<SessionFormRawValue['endTime']>;
  sessionAnalytic: FormControl<SessionFormRawValue['sessionAnalytic']>;
  kanbanBoard: FormControl<SessionFormRawValue['kanbanBoard']>;
  pomodoroTimer: FormControl<SessionFormRawValue['pomodoroTimer']>;
  playlist: FormControl<SessionFormRawValue['playlist']>;
};

export type SessionFormGroup = FormGroup<SessionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SessionFormService {
  createSessionFormGroup(session: SessionFormGroupInput = { id: null }): SessionFormGroup {
    const sessionRawValue = this.convertSessionToSessionRawValue({
      ...this.getFormDefaults(),
      ...session,
    });
    return new FormGroup<SessionFormGroupContent>({
      id: new FormControl(
        { value: sessionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(sessionRawValue.title),
      joinCode: new FormControl(sessionRawValue.joinCode),
      userIdList: new FormControl(sessionRawValue.userIdList),
      startTime: new FormControl(sessionRawValue.startTime),
      endTime: new FormControl(sessionRawValue.endTime),
      sessionAnalytic: new FormControl(sessionRawValue.sessionAnalytic),
      kanbanBoard: new FormControl(sessionRawValue.kanbanBoard),
      pomodoroTimer: new FormControl(sessionRawValue.pomodoroTimer),
      playlist: new FormControl(sessionRawValue.playlist),
    });
  }

  getSession(form: SessionFormGroup): ISession | NewSession {
    return this.convertSessionRawValueToSession(form.getRawValue() as SessionFormRawValue | NewSessionFormRawValue);
  }

  resetForm(form: SessionFormGroup, session: SessionFormGroupInput): void {
    const sessionRawValue = this.convertSessionToSessionRawValue({ ...this.getFormDefaults(), ...session });
    form.reset(
      {
        ...sessionRawValue,
        id: { value: sessionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SessionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startTime: currentTime,
      endTime: currentTime,
    };
  }

  private convertSessionRawValueToSession(rawSession: SessionFormRawValue | NewSessionFormRawValue): ISession | NewSession {
    return {
      ...rawSession,
      startTime: dayjs(rawSession.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawSession.endTime, DATE_TIME_FORMAT),
    };
  }

  private convertSessionToSessionRawValue(
    session: ISession | (Partial<NewSession> & SessionFormDefaults)
  ): SessionFormRawValue | PartialWithRequiredKeyOf<NewSessionFormRawValue> {
    return {
      ...session,
      startTime: session.startTime ? session.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: session.endTime ? session.endTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
