import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPomodoroTimer, NewPomodoroTimer } from '../pomodoro-timer.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPomodoroTimer for edit and NewPomodoroTimerFormGroupInput for create.
 */
type PomodoroTimerFormGroupInput = IPomodoroTimer | PartialWithRequiredKeyOf<NewPomodoroTimer>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPomodoroTimer | NewPomodoroTimer> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

type PomodoroTimerFormRawValue = FormValueOf<IPomodoroTimer>;

type NewPomodoroTimerFormRawValue = FormValueOf<NewPomodoroTimer>;

type PomodoroTimerFormDefaults = Pick<NewPomodoroTimer, 'id' | 'startTime' | 'endTime'>;

type PomodoroTimerFormGroupContent = {
  id: FormControl<PomodoroTimerFormRawValue['id'] | NewPomodoroTimer['id']>;
  startTime: FormControl<PomodoroTimerFormRawValue['startTime']>;
  endTime: FormControl<PomodoroTimerFormRawValue['endTime']>;
  state: FormControl<PomodoroTimerFormRawValue['state']>;
  type: FormControl<PomodoroTimerFormRawValue['type']>;
  duration: FormControl<PomodoroTimerFormRawValue['duration']>;
};

export type PomodoroTimerFormGroup = FormGroup<PomodoroTimerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PomodoroTimerFormService {
  createPomodoroTimerFormGroup(pomodoroTimer: PomodoroTimerFormGroupInput = { id: null }): PomodoroTimerFormGroup {
    const pomodoroTimerRawValue = this.convertPomodoroTimerToPomodoroTimerRawValue({
      ...this.getFormDefaults(),
      ...pomodoroTimer,
    });
    return new FormGroup<PomodoroTimerFormGroupContent>({
      id: new FormControl(
        { value: pomodoroTimerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      startTime: new FormControl(pomodoroTimerRawValue.startTime),
      endTime: new FormControl(pomodoroTimerRawValue.endTime),
      state: new FormControl(pomodoroTimerRawValue.state),
      type: new FormControl(pomodoroTimerRawValue.type),
      duration: new FormControl(pomodoroTimerRawValue.duration),
    });
  }

  getPomodoroTimer(form: PomodoroTimerFormGroup): IPomodoroTimer | NewPomodoroTimer {
    return this.convertPomodoroTimerRawValueToPomodoroTimer(form.getRawValue() as PomodoroTimerFormRawValue | NewPomodoroTimerFormRawValue);
  }

  resetForm(form: PomodoroTimerFormGroup, pomodoroTimer: PomodoroTimerFormGroupInput): void {
    const pomodoroTimerRawValue = this.convertPomodoroTimerToPomodoroTimerRawValue({ ...this.getFormDefaults(), ...pomodoroTimer });
    form.reset(
      {
        ...pomodoroTimerRawValue,
        id: { value: pomodoroTimerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PomodoroTimerFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startTime: currentTime,
      endTime: currentTime,
    };
  }

  private convertPomodoroTimerRawValueToPomodoroTimer(
    rawPomodoroTimer: PomodoroTimerFormRawValue | NewPomodoroTimerFormRawValue
  ): IPomodoroTimer | NewPomodoroTimer {
    return {
      ...rawPomodoroTimer,
      startTime: dayjs(rawPomodoroTimer.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawPomodoroTimer.endTime, DATE_TIME_FORMAT),
    };
  }

  private convertPomodoroTimerToPomodoroTimerRawValue(
    pomodoroTimer: IPomodoroTimer | (Partial<NewPomodoroTimer> & PomodoroTimerFormDefaults)
  ): PomodoroTimerFormRawValue | PartialWithRequiredKeyOf<NewPomodoroTimerFormRawValue> {
    return {
      ...pomodoroTimer,
      startTime: pomodoroTimer.startTime ? pomodoroTimer.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: pomodoroTimer.endTime ? pomodoroTimer.endTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
