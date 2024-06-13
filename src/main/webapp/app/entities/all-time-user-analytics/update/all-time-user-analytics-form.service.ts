import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAllTimeUserAnalytics, NewAllTimeUserAnalytics } from '../all-time-user-analytics.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAllTimeUserAnalytics for edit and NewAllTimeUserAnalyticsFormGroupInput for create.
 */
type AllTimeUserAnalyticsFormGroupInput = IAllTimeUserAnalytics | PartialWithRequiredKeyOf<NewAllTimeUserAnalytics>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAllTimeUserAnalytics | NewAllTimeUserAnalytics> = Omit<T, 'mostFocusedPeriod'> & {
  mostFocusedPeriod?: string | null;
};

type AllTimeUserAnalyticsFormRawValue = FormValueOf<IAllTimeUserAnalytics>;

type NewAllTimeUserAnalyticsFormRawValue = FormValueOf<NewAllTimeUserAnalytics>;

type AllTimeUserAnalyticsFormDefaults = Pick<NewAllTimeUserAnalytics, 'id' | 'mostFocusedPeriod'>;

type AllTimeUserAnalyticsFormGroupContent = {
  id: FormControl<AllTimeUserAnalyticsFormRawValue['id'] | NewAllTimeUserAnalytics['id']>;
  totalStudyTime: FormControl<AllTimeUserAnalyticsFormRawValue['totalStudyTime']>;
  totalPomodoroSession: FormControl<AllTimeUserAnalyticsFormRawValue['totalPomodoroSession']>;
  dailyStreaks: FormControl<AllTimeUserAnalyticsFormRawValue['dailyStreaks']>;
  mostFocusedPeriod: FormControl<AllTimeUserAnalyticsFormRawValue['mostFocusedPeriod']>;
  taskCompletionRate: FormControl<AllTimeUserAnalyticsFormRawValue['taskCompletionRate']>;
  averageFocusDuration: FormControl<AllTimeUserAnalyticsFormRawValue['averageFocusDuration']>;
  focusCount: FormControl<AllTimeUserAnalyticsFormRawValue['focusCount']>;
  totalFocusDuration: FormControl<AllTimeUserAnalyticsFormRawValue['totalFocusDuration']>;
  sessionRecord: FormControl<AllTimeUserAnalyticsFormRawValue['sessionRecord']>;
  totalBreakTime: FormControl<AllTimeUserAnalyticsFormRawValue['totalBreakTime']>;
  averageBreakDuration: FormControl<AllTimeUserAnalyticsFormRawValue['averageBreakDuration']>;
};

export type AllTimeUserAnalyticsFormGroup = FormGroup<AllTimeUserAnalyticsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AllTimeUserAnalyticsFormService {
  createAllTimeUserAnalyticsFormGroup(
    allTimeUserAnalytics: AllTimeUserAnalyticsFormGroupInput = { id: null }
  ): AllTimeUserAnalyticsFormGroup {
    const allTimeUserAnalyticsRawValue = this.convertAllTimeUserAnalyticsToAllTimeUserAnalyticsRawValue({
      ...this.getFormDefaults(),
      ...allTimeUserAnalytics,
    });
    return new FormGroup<AllTimeUserAnalyticsFormGroupContent>({
      id: new FormControl(
        { value: allTimeUserAnalyticsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      totalStudyTime: new FormControl(allTimeUserAnalyticsRawValue.totalStudyTime),
      totalPomodoroSession: new FormControl(allTimeUserAnalyticsRawValue.totalPomodoroSession),
      dailyStreaks: new FormControl(allTimeUserAnalyticsRawValue.dailyStreaks),
      mostFocusedPeriod: new FormControl(allTimeUserAnalyticsRawValue.mostFocusedPeriod),
      taskCompletionRate: new FormControl(allTimeUserAnalyticsRawValue.taskCompletionRate),
      averageFocusDuration: new FormControl(allTimeUserAnalyticsRawValue.averageFocusDuration),
      focusCount: new FormControl(allTimeUserAnalyticsRawValue.focusCount),
      totalFocusDuration: new FormControl(allTimeUserAnalyticsRawValue.totalFocusDuration),
      sessionRecord: new FormControl(allTimeUserAnalyticsRawValue.sessionRecord),
      totalBreakTime: new FormControl(allTimeUserAnalyticsRawValue.totalBreakTime),
      averageBreakDuration: new FormControl(allTimeUserAnalyticsRawValue.averageBreakDuration),
    });
  }

  getAllTimeUserAnalytics(form: AllTimeUserAnalyticsFormGroup): IAllTimeUserAnalytics | NewAllTimeUserAnalytics {
    return this.convertAllTimeUserAnalyticsRawValueToAllTimeUserAnalytics(
      form.getRawValue() as AllTimeUserAnalyticsFormRawValue | NewAllTimeUserAnalyticsFormRawValue
    );
  }

  resetForm(form: AllTimeUserAnalyticsFormGroup, allTimeUserAnalytics: AllTimeUserAnalyticsFormGroupInput): void {
    const allTimeUserAnalyticsRawValue = this.convertAllTimeUserAnalyticsToAllTimeUserAnalyticsRawValue({
      ...this.getFormDefaults(),
      ...allTimeUserAnalytics,
    });
    form.reset(
      {
        ...allTimeUserAnalyticsRawValue,
        id: { value: allTimeUserAnalyticsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AllTimeUserAnalyticsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      mostFocusedPeriod: currentTime,
    };
  }

  private convertAllTimeUserAnalyticsRawValueToAllTimeUserAnalytics(
    rawAllTimeUserAnalytics: AllTimeUserAnalyticsFormRawValue | NewAllTimeUserAnalyticsFormRawValue
  ): IAllTimeUserAnalytics | NewAllTimeUserAnalytics {
    return {
      ...rawAllTimeUserAnalytics,
      mostFocusedPeriod: dayjs(rawAllTimeUserAnalytics.mostFocusedPeriod, DATE_TIME_FORMAT),
    };
  }

  private convertAllTimeUserAnalyticsToAllTimeUserAnalyticsRawValue(
    allTimeUserAnalytics: IAllTimeUserAnalytics | (Partial<NewAllTimeUserAnalytics> & AllTimeUserAnalyticsFormDefaults)
  ): AllTimeUserAnalyticsFormRawValue | PartialWithRequiredKeyOf<NewAllTimeUserAnalyticsFormRawValue> {
    return {
      ...allTimeUserAnalytics,
      mostFocusedPeriod: allTimeUserAnalytics.mostFocusedPeriod
        ? allTimeUserAnalytics.mostFocusedPeriod.format(DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
