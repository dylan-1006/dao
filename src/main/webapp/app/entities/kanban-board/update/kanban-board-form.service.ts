import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IKanbanBoard, NewKanbanBoard } from '../kanban-board.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IKanbanBoard for edit and NewKanbanBoardFormGroupInput for create.
 */
type KanbanBoardFormGroupInput = IKanbanBoard | PartialWithRequiredKeyOf<NewKanbanBoard>;

type KanbanBoardFormDefaults = Pick<NewKanbanBoard, 'id' | 'labels'>;

type KanbanBoardFormGroupContent = {
  id: FormControl<IKanbanBoard['id'] | NewKanbanBoard['id']>;
  title: FormControl<IKanbanBoard['title']>;
  description: FormControl<IKanbanBoard['description']>;
  labels: FormControl<IKanbanBoard['labels']>;
};

export type KanbanBoardFormGroup = FormGroup<KanbanBoardFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class KanbanBoardFormService {
  createKanbanBoardFormGroup(kanbanBoard: KanbanBoardFormGroupInput = { id: null }): KanbanBoardFormGroup {
    const kanbanBoardRawValue = {
      ...this.getFormDefaults(),
      ...kanbanBoard,
    };
    return new FormGroup<KanbanBoardFormGroupContent>({
      id: new FormControl(
        { value: kanbanBoardRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(kanbanBoardRawValue.title),
      description: new FormControl(kanbanBoardRawValue.description),
      labels: new FormControl(kanbanBoardRawValue.labels ?? []),
    });
  }

  getKanbanBoard(form: KanbanBoardFormGroup): IKanbanBoard | NewKanbanBoard {
    return form.getRawValue() as IKanbanBoard | NewKanbanBoard;
  }

  resetForm(form: KanbanBoardFormGroup, kanbanBoard: KanbanBoardFormGroupInput): void {
    const kanbanBoardRawValue = { ...this.getFormDefaults(), ...kanbanBoard };
    form.reset(
      {
        ...kanbanBoardRawValue,
        id: { value: kanbanBoardRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): KanbanBoardFormDefaults {
    return {
      id: null,
      labels: [],
    };
  }
}
