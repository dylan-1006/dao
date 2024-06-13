import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISessionAnalytic, NewSessionAnalytic } from '../session-analytic.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISessionAnalytic for edit and NewSessionAnalyticFormGroupInput for create.
 */
type SessionAnalyticFormGroupInput = ISessionAnalytic | PartialWithRequiredKeyOf<NewSessionAnalytic>;

type SessionAnalyticFormDefaults = Pick<NewSessionAnalytic, 'id'>;

type SessionAnalyticFormGroupContent = {
  id: FormControl<ISessionAnalytic['id'] | NewSessionAnalytic['id']>;
  sessionDuration: FormControl<ISessionAnalytic['sessionDuration']>;
  taskTotal: FormControl<ISessionAnalytic['taskTotal']>;
  taskCompleted: FormControl<ISessionAnalytic['taskCompleted']>;
  pointsGained: FormControl<ISessionAnalytic['pointsGained']>;
  numOfPomodoroFinished: FormControl<ISessionAnalytic['numOfPomodoroFinished']>;
  praiseCount: FormControl<ISessionAnalytic['praiseCount']>;
  user: FormControl<ISessionAnalytic['user']>;
  allTimeUserAnalytics: FormControl<ISessionAnalytic['allTimeUserAnalytics']>;
};

export type SessionAnalyticFormGroup = FormGroup<SessionAnalyticFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SessionAnalyticFormService {
  createSessionAnalyticFormGroup(sessionAnalytic: SessionAnalyticFormGroupInput = { id: null }): SessionAnalyticFormGroup {
    const sessionAnalyticRawValue = {
      ...this.getFormDefaults(),
      ...sessionAnalytic,
    };
    return new FormGroup<SessionAnalyticFormGroupContent>({
      id: new FormControl(
        { value: sessionAnalyticRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      sessionDuration: new FormControl(sessionAnalyticRawValue.sessionDuration),
      taskTotal: new FormControl(sessionAnalyticRawValue.taskTotal),
      taskCompleted: new FormControl(sessionAnalyticRawValue.taskCompleted),
      pointsGained: new FormControl(sessionAnalyticRawValue.pointsGained),
      numOfPomodoroFinished: new FormControl(sessionAnalyticRawValue.numOfPomodoroFinished),
      praiseCount: new FormControl(sessionAnalyticRawValue.praiseCount),
      user: new FormControl(sessionAnalyticRawValue.user),
      allTimeUserAnalytics: new FormControl(sessionAnalyticRawValue.allTimeUserAnalytics),
    });
  }

  getSessionAnalytic(form: SessionAnalyticFormGroup): ISessionAnalytic | NewSessionAnalytic {
    return form.getRawValue() as ISessionAnalytic | NewSessionAnalytic;
  }

  resetForm(form: SessionAnalyticFormGroup, sessionAnalytic: SessionAnalyticFormGroupInput): void {
    const sessionAnalyticRawValue = { ...this.getFormDefaults(), ...sessionAnalytic };
    form.reset(
      {
        ...sessionAnalyticRawValue,
        id: { value: sessionAnalyticRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SessionAnalyticFormDefaults {
    return {
      id: null,
    };
  }
}
