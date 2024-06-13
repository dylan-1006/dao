import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IKanbanTaskComment, NewKanbanTaskComment } from '../kanban-task-comment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IKanbanTaskComment for edit and NewKanbanTaskCommentFormGroupInput for create.
 */
type KanbanTaskCommentFormGroupInput = IKanbanTaskComment | PartialWithRequiredKeyOf<NewKanbanTaskComment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IKanbanTaskComment | NewKanbanTaskComment> = Omit<T, 'timeStamp'> & {
  timeStamp?: string | null;
};

type KanbanTaskCommentFormRawValue = FormValueOf<IKanbanTaskComment>;

type NewKanbanTaskCommentFormRawValue = FormValueOf<NewKanbanTaskComment>;

type KanbanTaskCommentFormDefaults = Pick<NewKanbanTaskComment, 'id' | 'timeStamp'>;

type KanbanTaskCommentFormGroupContent = {
  id: FormControl<KanbanTaskCommentFormRawValue['id'] | NewKanbanTaskComment['id']>;
  content: FormControl<KanbanTaskCommentFormRawValue['content']>;
  timeStamp: FormControl<KanbanTaskCommentFormRawValue['timeStamp']>;
  author: FormControl<KanbanTaskCommentFormRawValue['author']>;
  kanbanTask: FormControl<KanbanTaskCommentFormRawValue['kanbanTask']>;
};

export type KanbanTaskCommentFormGroup = FormGroup<KanbanTaskCommentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class KanbanTaskCommentFormService {
  createKanbanTaskCommentFormGroup(kanbanTaskComment: KanbanTaskCommentFormGroupInput = { id: null }): KanbanTaskCommentFormGroup {
    const kanbanTaskCommentRawValue = this.convertKanbanTaskCommentToKanbanTaskCommentRawValue({
      ...this.getFormDefaults(),
      ...kanbanTaskComment,
    });
    return new FormGroup<KanbanTaskCommentFormGroupContent>({
      id: new FormControl(
        { value: kanbanTaskCommentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      content: new FormControl(kanbanTaskCommentRawValue.content),
      timeStamp: new FormControl(kanbanTaskCommentRawValue.timeStamp),
      author: new FormControl(kanbanTaskCommentRawValue.author),
      kanbanTask: new FormControl(kanbanTaskCommentRawValue.kanbanTask),
    });
  }

  getKanbanTaskComment(form: KanbanTaskCommentFormGroup): IKanbanTaskComment | NewKanbanTaskComment {
    return this.convertKanbanTaskCommentRawValueToKanbanTaskComment(
      form.getRawValue() as KanbanTaskCommentFormRawValue | NewKanbanTaskCommentFormRawValue
    );
  }

  resetForm(form: KanbanTaskCommentFormGroup, kanbanTaskComment: KanbanTaskCommentFormGroupInput): void {
    const kanbanTaskCommentRawValue = this.convertKanbanTaskCommentToKanbanTaskCommentRawValue({
      ...this.getFormDefaults(),
      ...kanbanTaskComment,
    });
    form.reset(
      {
        ...kanbanTaskCommentRawValue,
        id: { value: kanbanTaskCommentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): KanbanTaskCommentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timeStamp: currentTime,
    };
  }

  private convertKanbanTaskCommentRawValueToKanbanTaskComment(
    rawKanbanTaskComment: KanbanTaskCommentFormRawValue | NewKanbanTaskCommentFormRawValue
  ): IKanbanTaskComment | NewKanbanTaskComment {
    return {
      ...rawKanbanTaskComment,
      timeStamp: dayjs(rawKanbanTaskComment.timeStamp, DATE_TIME_FORMAT),
    };
  }

  private convertKanbanTaskCommentToKanbanTaskCommentRawValue(
    kanbanTaskComment: IKanbanTaskComment | (Partial<NewKanbanTaskComment> & KanbanTaskCommentFormDefaults)
  ): KanbanTaskCommentFormRawValue | PartialWithRequiredKeyOf<NewKanbanTaskCommentFormRawValue> {
    return {
      ...kanbanTaskComment,
      timeStamp: kanbanTaskComment.timeStamp ? kanbanTaskComment.timeStamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
