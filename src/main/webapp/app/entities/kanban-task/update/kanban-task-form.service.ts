import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IKanbanTask, NewKanbanTask } from '../kanban-task.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IKanbanTask for edit and NewKanbanTaskFormGroupInput for create.
 */
type KanbanTaskFormGroupInput = IKanbanTask | PartialWithRequiredKeyOf<NewKanbanTask>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IKanbanTask | NewKanbanTask> = Omit<T, 'dueDate'> & {
  dueDate?: string | null;
};

type KanbanTaskFormRawValue = FormValueOf<IKanbanTask>;

type NewKanbanTaskFormRawValue = FormValueOf<NewKanbanTask>;

type KanbanTaskFormDefaults = Pick<NewKanbanTask, 'id' | 'dueDate' | 'labels'>;

type KanbanTaskFormGroupContent = {
  id: FormControl<KanbanTaskFormRawValue['id'] | NewKanbanTask['id']>;
  title: FormControl<KanbanTaskFormRawValue['title']>;
  description: FormControl<KanbanTaskFormRawValue['description']>;
  taskStatus: FormControl<KanbanTaskFormRawValue['taskStatus']>;
  dueDate: FormControl<KanbanTaskFormRawValue['dueDate']>;
  author: FormControl<KanbanTaskFormRawValue['author']>;
  labels: FormControl<KanbanTaskFormRawValue['labels']>;
  kanbanBoard: FormControl<KanbanTaskFormRawValue['kanbanBoard']>;
};

export type KanbanTaskFormGroup = FormGroup<KanbanTaskFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class KanbanTaskFormService {
  createKanbanTaskFormGroup(kanbanTask: KanbanTaskFormGroupInput = { id: null }): KanbanTaskFormGroup {
    const kanbanTaskRawValue = this.convertKanbanTaskToKanbanTaskRawValue({
      ...this.getFormDefaults(),
      ...kanbanTask,
    });
    return new FormGroup<KanbanTaskFormGroupContent>({
      id: new FormControl(
        { value: kanbanTaskRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(kanbanTaskRawValue.title),
      description: new FormControl(kanbanTaskRawValue.description),
      taskStatus: new FormControl(kanbanTaskRawValue.taskStatus),
      dueDate: new FormControl(kanbanTaskRawValue.dueDate),
      author: new FormControl(kanbanTaskRawValue.author),
      labels: new FormControl(kanbanTaskRawValue.labels ?? []),
      kanbanBoard: new FormControl(kanbanTaskRawValue.kanbanBoard),
    });
  }

  getKanbanTask(form: KanbanTaskFormGroup): IKanbanTask | NewKanbanTask {
    return this.convertKanbanTaskRawValueToKanbanTask(form.getRawValue() as KanbanTaskFormRawValue | NewKanbanTaskFormRawValue);
  }

  resetForm(form: KanbanTaskFormGroup, kanbanTask: KanbanTaskFormGroupInput): void {
    const kanbanTaskRawValue = this.convertKanbanTaskToKanbanTaskRawValue({ ...this.getFormDefaults(), ...kanbanTask });
    form.reset(
      {
        ...kanbanTaskRawValue,
        id: { value: kanbanTaskRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): KanbanTaskFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dueDate: currentTime,
      labels: [],
    };
  }

  private convertKanbanTaskRawValueToKanbanTask(
    rawKanbanTask: KanbanTaskFormRawValue | NewKanbanTaskFormRawValue
  ): IKanbanTask | NewKanbanTask {
    return {
      ...rawKanbanTask,
      dueDate: dayjs(rawKanbanTask.dueDate, DATE_TIME_FORMAT),
    };
  }

  private convertKanbanTaskToKanbanTaskRawValue(
    kanbanTask: IKanbanTask | (Partial<NewKanbanTask> & KanbanTaskFormDefaults)
  ): KanbanTaskFormRawValue | PartialWithRequiredKeyOf<NewKanbanTaskFormRawValue> {
    return {
      ...kanbanTask,
      dueDate: kanbanTask.dueDate ? kanbanTask.dueDate.format(DATE_TIME_FORMAT) : undefined,
      labels: kanbanTask.labels ?? [],
    };
  }
}
